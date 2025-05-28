// import img from "next/im g"
// import a from "next/a"
import { ChevronLeft, ChevronRight, Upload } from "lucide-react"
// import { Button } from "@/components/ui/button"
import Button from "../components/ui/button"
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header - Giant Blank Picture Area in Slideshow Container */}
      <header className="relative w-full h-[550px] overflow-hidde">
        <div className="absolute inset-0 z-10">
          <img
            src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg"
            alt="Giant Blank Picture Area"
            fill
            className="object-cover"
          />
        </div>

        {/* Slideshow Navigation Arrows */}
        <button className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 md:h-16 md:w-16 bg-amber-600/80 hover:bg-amber-600 border-none shadow-lg flex items-center justify-center">
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </button>

        <button className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 md:h-16 md:w-16 bg-amber-600/80 hover:bg-amber-600 border-none shadow-lg flex items-center justify-center">
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </button>

        {/* Slideshow Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          <div className="w-3 h-3 rounded-full bg-white"></div>
          <div className="w-3 h-3 rounded-full bg-white/50"></div>
          <div className="w-3 h-3 rounded-full bg-white/50"></div>
          <div className="w-3 h-3 rounded-full bg-white/50"></div>
        </div>
      </header>

      {/* Description */}
      <section className="bg-white py-4 px-4 md:py-6 z-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">Omiga — CKB Inscription</h2>
          <p className="text-sm text-black mt-1">
            A decentralized inscription protocol on CKB, empowering fair minting and management of digital assets like
            MEMES, fueling cross-chain innovation and boosting Nervos Network's ecosystem.
          </p>
        </div>
      </section>

      {/* Spark Granted Projects */}
      <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Spark Granted Projects</h2>
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <Button className="bg-green-500  hover:bg-green-600 text-white flex items-center gap-2 w-full md:w-auto">
              <Upload size={18} />
              <span>Upload Your Project</span>
            </Button>
            <div className="flex items-center">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 mr-3 bg-amber-50/10 border-none">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-amber-50/10 border-none">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-yellow-100 rounded-2xl overflow-hidden h-52 shadow-lg">
            <div className="h-32 relative bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <img src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg" alt="Quantum Purge" fill className="object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium">Mixin</span>
              </div>
            </div>
            <div className="p-4 flex flex-col justify-between h-20">
              <h3 className="text-lg font-bold text-black">Quantum Purge</h3>
              <div className="flex justify-between items-center">
                <p className="text-sm text-black">A spin-quantum wallet for CKB</p>
                <p className="text-black font-bold">700 USDT</p>
              </div>
            </div>
          </div>
          <div className="border border-dashed border-gray-700 rounded-2xl h-52 shadow-lg"></div>
          <div className="border border-dashed border-gray-700 rounded-2xl h-52 shadow-lg"></div>
        </div>
      </section>

      {/* Highlighted Projects */}
      <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Highlighted Projects</h2>

        <div className="space-y-12">
          {/* Nervape - Now Clickable */}
          <a href="/nervape" className="block">
            <div className="bg-blue-900/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow cursor-pointer">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-[400px] relative">
                  <img src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg" alt="Nervape" fill className="object-cover" />
                  <div className="absolute top-6 left-6 flex gap-3">
                    <span className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium">NFT</span>
                    <span className="bg-gray-500 text-white text-sm px-4 py-2 rounded-full font-medium">Game</span>
                  </div>
                </div>
                <div className="p-4 md:p-8 flex flex-col justify-center">
                  <div className="flex justify-center items-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-black">Nervape</h3>
                  </div>
                  <p className="text-base text-black leading-relaxed">
                    A vibrant digital realm on the CKB blockchain, offers an extraordinary haven where creators conjure
                    and trade digital treasures across chains, igniting a seamless alchemy of cross-chain artistry
                    amidst CKB's ecosystem, creating a constellation of developers and artists in a harmonious digital
                    tapestry. Like a radiant ember, Nervape invokes the flames of interoperability and imagination,
                    forever enriching the boundless expanse of Nervos Network's crypto-economy.
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* Cellula */}
          <div className="bg-blue-900/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[400px] relative order-1 lg:order-2">
                <img src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg" alt="Cellula" fill className="object-cover" />
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium">NFT</span>
                  <span className="bg-gray-500 text-white text-sm px-4 py-2 rounded-full font-medium">Game</span>
                </div>
              </div>
              <div className="p-4 md:p-8 flex flex-col justify-center order-2 lg:order-1">
                <div className="flex justify-center items-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-black">Cellula</h3>
                </div>
                <p className="text-base text-black leading-relaxed">
                  A celestial symphony on the CKB blockchain, weaves an AI-driven gaming cosmos where BLDAO NFTs dance
                  across the digital firmament, harmoniously crafting a tapestry of boundless digital life. Like a
                  cosmic loom, it intertwines artful minting and on-chain innovation, birthing a kaleidoscope of
                  meticulously crafted galaxies. Its radiant partnership with Nervos ignites CKB's interstellar
                  potential, heralding a new epoch in the blockchain's luminous journey.
                </p>
              </div>
            </div>
          </div>

          {/* JoyID */}
          <div className="bg-blue-900/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[400px] relative">
                <img src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg" alt="JoyID" fill className="object-cover" />
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium">NFT</span>
                  <span className="bg-gray-500 text-white text-sm px-4 py-2 rounded-full font-medium">Game</span>
                </div>
              </div>
              <div className="p-4 md:p-8 flex flex-col justify-center">
                <div className="flex justify-center items-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-black">JoyID</h3>
                </div>
                <p className="text-base text-black leading-relaxed">
                  A luminous thread in the CKB tapestry, weaves a decentralized identity realm where users wield
                  sovereign control over their digital essence across blockchain's boundless stage. Its elegant fusion
                  of passkey authentication and cross-chain sensory perception empowers users to navigate the vast
                  Nervos Network's thriving crypto-economy. Like a radiant beacon, JoyID illuminates CKB's ecosystem,
                  forever transforming the landscape of digital innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Projects */}
      <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Premium Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* HueHub */}
          <div className="bg-white border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-[200px] relative">
              <img src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg" alt="HueHub" fill className="object-cover" />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium">NFT</span>
                <span className="bg-gray-500 text-white text-sm px-4 py-2 rounded-full font-medium">Game</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold text-black mb-3">HueHub</h3>
              <p className="text-sm text-black leading-relaxed">
                A decentralized exchange on CKB, empowers seamless trading and fair issuance of Omni-assets, enhancing
                Bitcoin's functionality and enriching Nervos Network's vibrant ecosystem.
              </p>
            </div>
          </div>

          {/* DotBit */}
          <div className="bg-white border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
            <div className="h-[200px] relative">
              <img src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg" alt="DotBit" fill className="object-cover" />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium">NFT</span>
                <span className="bg-gray-500 text-white text-sm px-4 py-2 rounded-full font-medium">Game</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold text-black mb-3">DotBit</h3>
              <p className="text-sm text-black leading-relaxed">
                A decentralized domain name system on CKB, enables users to register and manage their digital identities
                across the Nervos Network, fostering a more accessible and user-friendly blockchain ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community-driven Projects */}
      <section className="max-w-7xl mx-auto py-8 px-4 md:py-12 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Community-driven Projects</h2>
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 mr-3 bg-amber-50/10 border-none">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-amber-50/10 border-none">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* NervDao - Redesigned with bigger avatar */}
          <div className="bg-white rounded-2xl p-6 h-52 shadow-lg relative">
            <div className="flex items-start">
              <div className="bg-cyan-500 rounded-md h-16 w-16 md:h-20 md:w-20 flex items-center justify-center shadow-lg mr-4">
                <img
                  src="https://ckbdapps.com/dappList/rgbpp/rgbpp-hero.jpeg"
                  alt="NervDao"
                  width={64}
                  height={64}
                  className="rounded-md"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg md:text-xl text-black">NervDao</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">NFT</span>
                  <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-medium">Game</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm text-black">
                An advanced implementation of the Nervos DAO with enhanced governance features and cross-chain
                capabilities
              </p>
            </div>
          </div>

          <div className="border border-dashed border-gray-700 rounded-2xl h-52 shadow-lg"></div>
          <div className="border border-dashed border-gray-700 rounded-2xl h-52 shadow-lg"></div>
        </div>
      </section>

      {/* Community Fund DAO - Standalone Section */}
      <section className="max-w-7xl mx-auto pb-8 px-4 md:pb-12">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl h-52 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-20"></div>
          <div className="h-full flex items-center justify-center relative z-10">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black text-center">Community Fund DAO</h3>
          </div>
        </div>
      </section>

  
    </div>
  )
}
