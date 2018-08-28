import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material'

import { DbService } from './db.service'
import { PopupService } from './popup.service'
import { UploadService } from './upload.service'
import { Embed } from '../shared/dynamic-form/models/embed.interface'

@Injectable()
export class CrudService {

    constructor(private db: DbService, private ps: PopupService, private us: UploadService, public sb: MatSnackBar) { }

    insertDialog(config, rec, path, embeds?: Embed[], alternativeFormActionTitle?: string) {
      const beforeInsertDialogEmbed: Function = this.getEmbed(embeds, 'beforeInsertDialog')
      if (beforeInsertDialogEmbed !== undefined) {if (beforeInsertDialogEmbed(rec)) { return Promise.resolve() }}
      config.forEach(eachConfig => this.db.getSetting(eachConfig.options).subscribe(setting => {eachConfig.options = setting ? setting : eachConfig.options}))
      let beforeInsertDialogEmbedAsyncPromise = Promise.resolve()
      const beforeInsertDialogEmbedAsync = this.getEmbed(embeds, 'beforeInsertDialogAsync')
      if (beforeInsertDialogEmbedAsync !== undefined) {
        beforeInsertDialogEmbedAsyncPromise = beforeInsertDialogEmbedAsync(rec)
      }
      return beforeInsertDialogEmbedAsyncPromise.then(() => {
        return this.ps.formDialog(1, config, rec, this.getEmbed(embeds, 'onValueChg'), alternativeFormActionTitle).then((frmResult: {response: string, value: {}}) => {
          if (frmResult && (frmResult.response === 'save')) {
            const snackBarRef = this.sb.open('Bewaren...', undefined, {duration: 1500})
            let saveEmbedPromise = Promise.resolve()
            const saveEmbed = this.getEmbed(embeds, 'beforeSave')
            if (saveEmbed !== undefined) {
              saveEmbedPromise = saveEmbed(1, frmResult.value)
            }
            saveEmbedPromise
            .then(() => {
              return this.db.addDoc(this.fixSubProperties(frmResult.value), path)
            })
            .catch(e => this.ps.buttonDialog('Bewaren mislukt \r\n' + e, 'OK'))
          }
        })
      })
    }

    changeDeleteDialog(config, rec, path, fld, embeds?: Embed[], alternativeFormActionTitle?: string) {
      const beforeChgDialogEmbed: Function = this.getEmbed(embeds, 'beforeChgDialog')
      if (beforeChgDialogEmbed !== undefined) {if (beforeChgDialogEmbed(rec, fld)) { return Promise.resolve() }}
      // let saveEmbed: Function // -- oppassen met wegdoen -- maar kan denk ik weg...
      // if(embeds != undefined){
      //   const saveEmbedIndex = embeds.findIndex(e => e.type == 'beforeSave')
      //   if(saveEmbedIndex != -1){saveEmbed = embeds[saveEmbedIndex].code}
      // }
      config.forEach(eachConfig => this.db.getSetting(eachConfig.options).subscribe(setting => {eachConfig.options = setting ? setting : eachConfig.options}))
      return this.ps.formDialog(2, config, rec, this.getEmbed(embeds, 'onValueChg'), alternativeFormActionTitle).then((frmResult: {response: string, value: {}}) => {
        if (frmResult && (frmResult.response === 'save')) {
          const snackBarRef = this.sb.open('Bewaren...', undefined, {duration: 1500})
          let saveEmbedPromise = Promise.resolve()
          const saveEmbed = this.getEmbed(embeds, 'beforeSave')
          if (saveEmbed !== undefined) {
            saveEmbedPromise = saveEmbed(1, frmResult.value)
          }
          saveEmbedPromise.then(() => {
            this.setNullValues(frmResult.value)
            return this.db.updateDoc(this.fixSubProperties(frmResult.value), `${path}/${rec['id']}`)
          }).catch(e => this.ps.buttonDialog('Bewaren mislukt \r\n' + e, 'OK'))
        }
        if (frmResult && (frmResult.response === 'delete')) {
          config.forEach(eachConfig => {
            if (eachConfig.type === 'filepick') {
              this.us.deleteUpload(rec[eachConfig.name])
            }
          })
          let deleteEmbedPromise = Promise.resolve()
          const deleteEmbed = this.getEmbed(embeds, 'beforeDelete')
          if (deleteEmbed !== undefined) {
            deleteEmbedPromise = deleteEmbed(1, rec )
          }
          deleteEmbedPromise.then(() => {
            // return Promise.resolve()
            return this.db.deleteDoc(`${path}/${rec['id']}`)
          }).catch(e => this.ps.buttonDialog('Verwijderen mislukt \r\n' + e, 'OK'))
        }
      })
    }

    setNullValues(o) {
      Object.keys(o).forEach(key => {
        if (o[key] === undefined) {o[key] = null}
      })
    }

    fixSubProperties(flatRec: {}) {
      // set flat result back to proper DB record, only two levels!
      const nestedRec = {}
      Object.keys(flatRec).map((key) => {
        const dot = key.indexOf('.')
        if (dot !== -1) {
          const prefix = key.slice(0, dot)
          const postfix = key.slice(dot + 1)
          nestedRec[prefix] = nestedRec[prefix] === undefined ? {} : nestedRec[prefix]
          nestedRec[prefix][postfix] = flatRec[key]
        } else {
          nestedRec[key] = flatRec[key]
        }
      })
      return nestedRec
    }

    getEmbed(embeds, embed) {
      if (embeds !== undefined) {
        const embedIndex = embeds.findIndex(e => e.type === embed)
        if (embedIndex !== -1) {return embeds[embedIndex].code}
      }
    }

  }
