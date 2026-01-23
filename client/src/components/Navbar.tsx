import { Disc3,Menu} from 'lucide-react'

function Navbar() {

  return (
    <div className='h-24 w-full border-b border-b-gray-600 flex items-center content-center justify-between px-28 text-white' >
        <div className='flex gap-4'><Disc3 className='text-white animate-spin [animation-duration:3s]' size={60}/> <span className='font-bold text-4xl mt-auto mb-auto'>SONIX</span></div>
         
        <div className=''> <Menu size={40}/></div>
    </div>
  ) 
}

export default Navbar