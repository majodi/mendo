import { Validators } from '@angular/forms';
import { EntityMeta } from '../../../models/entity-meta.model';
import { forceUppercase, forceCapitalize } from '../../../shared/dynamic-form/models/form-functions';
import { EmailDestination, Subscription } from '../../../models/message.model';

export interface Message {
    id: string;
    meta: EntityMeta;
    status: string; // new, send, sent
    channel: string; // email, push
    fromEmail: string;
    fromName: string;
    recipientSource: string; // user, organisation, employee
    user: string; // user
    organisation: string; // organisation
    employee: string; // employee
    recipientDesignation: string;
    toList: EmailDestination[];
    ccList: EmailDestination[];
    bccList: EmailDestination[];
    subscriptionList: Subscription[];
    subject: string;
    textContent: string;
    htmlContent: string;
    dataObject: {};
    actionsArray: {}[];
}

export const defaultTitle = 'Berichten'
export const defaultTitleIcon = 'message'
export const defaultColDef = [
    {name: 'status',                header: 'Status', iconSelect: rec => {return {new: 'fiber_new', send: 'send', sent: 'done', error: 'error'}[rec['status']]}, flex: '15'},
    {name: 'channel',               header: 'Kanaal', iconSelect: rec => {return {email: 'mail', push: 'chat'}[rec['channel']]}, flex: '15'},
    {name: 'fromName',              header: 'Van', sort: true, hideXs: true},
    {name: 'recipientDesignation',  header: 'Naar', sort: true},
    {name: 'subject',               header: 'Onderwerp', hideXs: true},
  ]
export const defaultFormConfig = [
    {type: 'stringdisplay', label: 'Status',        name: 'status',             placeholder: 'Status',          value: 'new', doNotPopulate: true},
    {type: 'stringdisplay', label: 'Status',        name: 'statusDisplay',      placeholder: 'Status',          value: 'Nieuw', hidden: true},
    {type: 'select',        label: 'Kanaal',        name: 'channel',            placeholder: 'Kanaal',          value: '', options: ['email', 'push']},
    {type: 'select',        label: 'Ontvanger bron',name: 'recipientSource',    placeholder: 'Ontvanger bron',  value: '', hidden: true, options: ['Gebruiker', 'Organisatie', 'Medewerker']},
    {type: 'lookup',        label: 'Gebruiker',     name: 'user',               placeholder: 'Gebruiker',       value: '', hidden: true, inputValueTransform: forceCapitalize, customLookupFld: {path: 'users', tbl: 'user', fld: 'displayName'}},
    {type: 'pulldown',      label: 'Organisatie',   name: 'organisation',       placeholder: 'Organisatie',     value: '', hidden: true, customLookupFld: {path: 'organisations', tbl: 'organisation', fld: 'address.name'}},
    {type: 'lookup',        label: 'Medewerker',    name: 'employee',           placeholder: 'Medewerker',      value: '', hidden: true, inputValueTransform: forceCapitalize, customLookupFld: {path: 'employees', tbl: 'employee', fld: 'address.name'}},
    {type: 'stringdisplay', label: 'Ontvanger',     name: 'recipientDesignation', placeholder: 'Ontvanger',     value: '', hidden: true},
    {type: 'input',         label: 'Onderwerp',     name: 'subject',            placeholder: 'Onderwerp',       value: ''},
    {type: 'input', inputLines: 5, label: 'Berichtinhoud', name: 'textContent', placeholder: 'Berichtinhoud', value: ''},
    {type: 'button',        label: 'Toon HTML inhoud', name: 'html',            placeholder: 'Toon HTML inhoud', value: ''},
  ]
