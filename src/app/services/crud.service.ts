import { Injectable } from '@angular/core';

import { DbService } from './db.service';
import { PopupService } from './popup.service';
import { UploadService } from './upload.service';
import { Embed } from '../shared/dynamic-form/models/embed.interface';

@Injectable()
export class CrudService {
  
    constructor(private db: DbService, private ps: PopupService, private us: UploadService) { }

    insertDialog(config, rec, path, embeds?: Embed[], alternativeFormActionTitle?: string) {
      config.forEach(config => this.db.getSetting(config.options).subscribe(setting => {config.options = setting ? setting : config.options}))
      return this.ps.formDialog(1, config, rec, this.getEmbed(embeds, 'onValueChg'), alternativeFormActionTitle).then((frmResult: {response: string, value: {}}) => {
        if(frmResult && (frmResult.response == 'save')){
          let saveEmbedPromise = Promise.resolve()
          let saveEmbed = this.getEmbed(embeds, 'beforeSave')
          if(saveEmbed != undefined){
            saveEmbedPromise = saveEmbed(1, frmResult.value)
          }
          saveEmbedPromise.then(() => {
            return this.db.addDoc(this.fixSubProperties(frmResult.value), path)
          })
        }
      })
    }
  
    changeDeleteDialog(config, rec, path, fld, embeds?: Embed[], alternativeFormActionTitle?: string) {
      let beforeChgDialogEmbed: Function = this.getEmbed(embeds, 'beforeChgDialog')
      if(beforeChgDialogEmbed != undefined){if(beforeChgDialogEmbed(rec, fld)) return Promise.resolve()}
      // let saveEmbed: Function // -- oppassen met wegdoen -- maar kan denk ik weg...
      // if(embeds != undefined){
      //   const saveEmbedIndex = embeds.findIndex(e => e.type == 'beforeSave')
      //   if(saveEmbedIndex != -1){saveEmbed = embeds[saveEmbedIndex].code}
      // }
      config.forEach(config => this.db.getSetting(config.options).subscribe(setting => {config.options = setting ? setting : config.options}))
      return this.ps.formDialog(2, config, rec, this.getEmbed(embeds, 'onValueChg'), alternativeFormActionTitle).then((frmResult: {response: string, value: {}}) => {
        if(frmResult && (frmResult.response == 'save')){
          let saveEmbedPromise = Promise.resolve()
          let saveEmbed = this.getEmbed(embeds, 'beforeSave')
          if(saveEmbed != undefined){
            saveEmbedPromise = saveEmbed(1, frmResult.value)
          }
          saveEmbedPromise.then(() => {
            return this.db.updateDoc(this.fixSubProperties(frmResult.value), `${path}/${rec['id']}`)
          })
        }
        if(frmResult && (frmResult.response == 'delete')){
          config.forEach(config => {
            if(config.type == 'filepick'){
              this.us.deleteUpload(rec[config.name])
            }
          })
          return this.db.deleteDoc(`${path}/${rec['id']}`)
        }
      })
    }
  
    fixSubProperties(flatRec: {}) {
      // set flat result back to proper DB record, only two levels!
      let nestedRec = {}
      Object.keys(flatRec).map((key)=>{
        let dot = key.indexOf('.')
        if(dot != -1){
          let prefix = key.slice(0, dot)
          let postfix = key.slice(dot+1)
          nestedRec[prefix] = nestedRec[prefix] == undefined ? {} : nestedRec[prefix]
          nestedRec[prefix][postfix] = flatRec[key]
        } else {
          nestedRec[key] = flatRec[key]
        }
      })
      return nestedRec
    }

    getEmbed(embeds, embed) {
      if(embeds != undefined){
        const embedIndex = embeds.findIndex(e => e.type == embed)
        if(embedIndex != -1){return embeds[embedIndex].code}
      }
    }

  }

  // 
//  aeen, atwee, adrie, avier, avijf, azes, azeven, aacht, anegen, atien, been, btwee, bdrie, bvier, bvijf, bzes, bzeven, bacht, bnegen, btien, ceen, ctwee, cdrie, cvier, cvijf, czes, czeven, cacht, cnegen, ctien, deen, dtwee, ddrie, dvier, dvijf, dzes, dzeven, dacht, dnegen, dtien, eeen, etwee, edrie, evier, evijf, ezes, ezeven, eacht, enegen, etien, feen, ftwee, fdrie, fvier, fvijf, fzes, fzeven, facht, fnegen, ftien, geen, gtwee, gdrie, gvier, gvijf, gzes, gzeven, gacht, gnegen, gtien, heen, htwee, hdrie, hvier, hvijf, hzes, hzeven, hacht, hnegen, htien, ieen, itwee, idrie, ivier, ivijf, izes, izeven, iacht, inegen, itien, jeen, jtwee, jdrie, jvier, jvijf, jzes, jzeven, jacht, jnegen, jtien