import {ProcessedRow, Row, RowRaw} from "../types/row"
export function formatRow(row:RowRaw): ProcessedRow{
   const email = (`${removeAccents(decode_utf8(row.Ime.trim().toLowerCase().split(" ")[0]))}.${removeAccents(decode_utf8(row.Priimek.trim().toLowerCase().split(" ")[0]))}@student.um.si`);
   return {name:row.Ime, surname:row.Priimek, group:row.Skupine, email} 
}

function decode_utf8(s:string) {
   return decodeURIComponent(s);
 }

function removeAccents(str:string) {
   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
 