import{RoomGame}from"@/components/room-game";export default async function Page({params}:{params:Promise<{code:string}>}){return<RoomGame code={(await params).code.toUpperCase()}/>}
