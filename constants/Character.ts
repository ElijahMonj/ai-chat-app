export default interface Character{
    id:string,
    avatar:string,
    name:string,
    description:string,
    custom:boolean,
    tone?:string,
    longDescription?:string,
    backstory?:string,
    owner?:string,
    prompt:string,
}