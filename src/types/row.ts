export interface RowRaw{
   Ime:string,
   Priimek:string,
   Skupine: string,
}
export interface Row{
   name:string,
   surname:string,
   group: string,
}
export interface ProcessedRow extends Row{
   email: string,
   subject?:string,
   body?: string
}