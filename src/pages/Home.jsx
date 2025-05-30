// import img from "next/im g"
// import a from "next/a"
import { ChevronLeft, ChevronRight, Sparkles, Zap, ExternalLink, Globe } from "lucide-react"
// import { Button } from "@/components/ui/button"
import Button from "../components/ui/button"

export default function Home() {
    return (
      <div className="min-h-screen bg-cosmic-light text-cosmic-dark overflow-hidden">
        {/* Main Content */}
        <div className="w-full">
          {/* Hero Section with Cosmic Background */}
          <section className="relative h-[600px] bg-cosmic-gradient overflow-hidden">
            {/* Cosmic Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px]"></div>
  
            <div className="absolute w-[500px] h-[500px] rounded-full bg-cosmic-purple/10 blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  
            <div className="absolute w-80 h-80 rounded-full border border-cosmic-neonBlue/20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
  
            <div className="absolute w-[400px] h-[400px] rounded-full border border-cosmic-purple/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin"></div>
  
            {/* Orbiting Planets */}
            <div className="absolute w-16 h-16 rounded-full bg-cosmic-purple/20 blur-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit"></div>
  
            <div
              className="absolute w-10 h-10 rounded-full bg-cosmic-neonBlue/20 blur-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit"
              style={{ animationDelay: "-5s" }}
            ></div>
  
            <div
              className="absolute w-12 h-12 rounded-full bg-cosmic-accent/20 blur-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit"
              style={{ animationDelay: "-10s" }}
            ></div>
  
            {/* Central Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-40 h-40 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-cosmic-purple/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center border border-cosmic-purple/30 shadow-lg">
                  <h1 className="font-future text-4xl text-cosmic-purple animate-glow">CKB</h1>
                </div>
              </div>
            </div>
  
            {/* Hero Content */}
            <div className="absolute bottom-16 left-0 right-0 text-center z-10">
              <h1 className="text-4xl md:text-5xl font-future mb-4 text-cosmic-dark">
                <span className="text-cosmic-accent">CKB</span> Inscription
              </h1>
              <p className="text-lg text-cosmic-gray max-w-2xl mx-auto font-tech">
                Explore the future of blockchain technology with CKB's innovative ecosystem
              </p>
            </div>
  
            {/* Navigation Arrows */}
            <button className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-cosmic-purple/30 flex items-center justify-center hover:bg-white transition-all shadow-lg">
              <ChevronLeft className="h-6 w-6 text-cosmic-purple" />
            </button>
  
            <button className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-cosmic-purple/30 flex items-center justify-center hover:bg-white transition-all shadow-lg">
              <ChevronRight className="h-6 w-6 text-cosmic-purple" />
            </button>
  
            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              <div className="w-3 h-3 rounded-full bg-cosmic-accent"></div>
              <div className="w-3 h-3 rounded-full bg-cosmic-gray/30"></div>
              <div className="w-3 h-3 rounded-full bg-cosmic-gray/30"></div>
              <div className="w-3 h-3 rounded-full bg-cosmic-gray/30"></div>
            </div>
          </section>
  
          {/* Description Section */}
          <section className="bg-cosmic-lightGray py-6 px-6 border-y border-cosmic-purple/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-grow bg-cosmic-purple/30"></div>
                <h2 className="text-xl font-future text-cosmic-accent">Omiga — CKB Inscription</h2>
                <div className="h-px flex-grow bg-cosmic-purple/30"></div>
              </div>
              <p className="text-cosmic-gray font-tech text-center">
                A decentralized inscription protocol on CKB, empowering fair minting and management of digital assets like
                MEMES, fueling cross-chain innovation and boosting Nervos Network's ecosystem.
              </p>
            </div>
          </section>
  
          {/* Spark Granted Projects */}
          <section className="bg-cosmic-light py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-cosmic-accent" />
                  <h2 className="text-2xl font-future text-cosmic-dark">Spark Granted Projects</h2>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
                  >
                    <ChevronLeft className="h-5 w-5 text-cosmic-purple" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
                  >
                    <ChevronRight className="h-5 w-5 text-cosmic-purple" />
                  </Button>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="/quantum-purge" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-[280px] shadow-lg">
                    <div className="h-40 relative bg-gradient-to-br from-purple-600 to-blue-600">
                      <img
                        src="/placeholder.svg?height=160&width=320&text=Quantum+Purge"
                        alt="Quantum Purge"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Mixin
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                        Quantum Purge
                      </h3>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm text-cosmic-gray font-tech">A spin-quantum wallet for CKB</p>
                        <p className="text-cosmic-accent font-future">700 USDT</p>
                      </div>
                    </div>
                  </div>
                </a>
  
                {/* Empty Project Slots */}
                <div className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-[280px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                      <Zap className="h-8 w-8 text-cosmic-purple/70" />
                    </div>
                    <p className="text-cosmic-gray font-tech">Future Project</p>
                  </div>
                </div>
  
                <div className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-[280px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                      <Zap className="h-8 w-8 text-cosmic-purple/70" />
                    </div>
                    <p className="text-cosmic-gray font-tech">Future Project</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Highlighted Projects */}
          <section className="bg-cosmic-light py-12 px-6 border-t border-cosmic-purple/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-12 bg-cosmic-purple/50"></div>
                <h2 className="text-2xl font-future text-cosmic-dark">Highlighted Projects</h2>
                <div className="h-px flex-grow bg-cosmic-purple/50"></div>
              </div>
  
              <div className="space-y-16">
                {/* Nervape */}
                <a href="/nervape" className="block group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 shadow-lg">
                    <div className="h-[400px] relative overflow-hidden">
                      <im g
                        src="/placeholder.svg?height=400&width=600&text=Nervape"
                        alt="Nervape"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-6 left-6 flex gap-3">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-none"></div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-md bg-cosmic-purple/10 flex items-center justify-center border border-cosmic-purple/30">
                          <span className="font-future text-cosmic-purple">N</span>
                        </div>
                        <h3 className="text-2xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                          Nervape
                        </h3>
                      </div>
                      <p className="text-cosmic-gray font-tech leading-relaxed">
                        A vibrant digital realm on the CKB blockchain, offers an extraordinary haven where creators
                        conjure and trade digital treasures across chains, igniting a seamless alchemy of cross-chain
                        artistry amidst CKB's ecosystem, creating a constellation of developers and artists in a
                        harmonious digital tapestry.
                      </p>
                      <div className="mt-6 flex justify-end">
                        <div className="inline-flex items-center gap-2 text-cosmic-accent font-tech group-hover:translate-x-1 transition-transform">
                          <span>Explore</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
  
                {/* Cellula */}
                <a href="/cellula" className="block group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 shadow-lg">
                    <div className="p-6 md:p-8 flex flex-col justify-center order-2 md:order-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-md bg-cosmic-purple/10 flex items-center justify-center border border-cosmic-purple/30">
                          <span className="font-future text-cosmic-purple">C</span>
                        </div>
                        <h3 className="text-2xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                          Cellula
                        </h3>
                      </div>
                      <p className="text-cosmic-gray font-tech leading-relaxed">
                        A celestial symphony on the CKB blockchain, weaves an AI-driven gaming cosmos where BLDAO NFTs
                        dance across the digital firmament, harmoniously crafting a tapestry of boundless digital life.
                        Like a cosmic loom, it intertwines artful minting and on-chain innovation.
                      </p>
                      <div className="mt-6 flex justify-end">
                        <div className="inline-flex items-center gap-2 text-cosmic-accent font-tech group-hover:translate-x-1 transition-transform">
                          <span>Explore</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="h-[400px] relative overflow-hidden order-1 md:order-2">
                      <img
                        src="../placeholder.svg?height=400&width=600&text=Cellula"
                        alt="Cellula"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-6 left-6 flex gap-3">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 md:bg-none"></div>
                    </div>
                  </div>
                </a>
  
                {/* JoyID */}
                <a href="/joyid" className="block group">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 shadow-lg">
                    <div className="h-[400px] relative overflow-hidden">
                      <img
                        src="/placeholder.svg?height=400&width=600&text=JoyID"
                        alt="JoyID"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-6 left-6 flex gap-3">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-none"></div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-md bg-cosmic-purple/10 flex items-center justify-center border border-cosmic-purple/30">
                          <span className="font-future text-cosmic-purple">J</span>
                        </div>
                        <h3 className="text-2xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                          JoyID
                        </h3>
                      </div>
                      <p className="text-cosmic-gray font-tech leading-relaxed">
                        A luminous thread in the CKB tapestry, weaves a decentralized identity realm where users wield
                        sovereign control over their digital essence across blockchain's boundless stage. Its elegant
                        fusion of passkey authentication and cross-chain sensory perception empowers users.
                      </p>
                      <div className="mt-6 flex justify-end">
                        <div className="inline-flex items-center gap-2 text-cosmic-accent font-tech group-hover:translate-x-1 transition-transform">
                          <span>Explore</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
  
          {/* Premium Projects */}
          <section className="bg-cosmic-light py-12 px-6 border-t border-cosmic-purple/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-12 bg-cosmic-purple/50"></div>
                <h2 className="text-2xl font-future text-cosmic-dark">Premium Projects</h2>
                <div className="h-px flex-grow bg-cosmic-purple/50"></div>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* HueHub */}
                <a href="/huehub" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-full shadow-lg">
                    <div className="h-48 relative">
                      <img
                        src="/placeholder.svg?height=200&width=400&text=HueHub"
                        alt="HueHub"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors mb-3">
                        HueHub
                      </h3>
                      <p className="text-cosmic-gray font-tech text-sm leading-relaxed">
                        A decentralized exchange on CKB, empowers seamless trading and fair issuance of Omni-assets,
                        enhancing Bitcoin's functionality and enriching Nervos Network's vibrant ecosystem.
                      </p>
                    </div>
                  </div>
                </a>
  
                {/* DotBit */}
                <a href="/dotbit" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-full shadow-lg">
                    <div className="h-48 relative">
                      <img
                        src="/placeholder.svg?height=200&width=400&text=DotBit"
                        alt="DotBit"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors mb-3">
                        DotBit
                      </h3>
                      <p className="text-cosmic-gray font-tech text-sm leading-relaxed">
                        A decentralized identity protocol on CKB, weaves a cross-chain tapestry of domain, user-friendly
                        addresses, and secure management of digital identity and asset management across blockchains.
                      </p>
                    </div>
                  </div>
                </a>
  
                {/* Stable++ */}
                <a href="/stable-plus-plus" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-full shadow-lg">
                    <div className="h-48 relative">
                      <img
                        src="/placeholder.svg?height=200&width=400&text=Stable++"
                        alt="Stable++"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors mb-3">
                        Stable++
                      </h3>
                      <p className="text-cosmic-gray font-tech text-sm leading-relaxed">
                        A decentralized stablecoin protocol on CKB, crafts BUSD through over-collateralized BTC assets,
                        enhancing stability and liquidity across the Bitcoin and RGB++ ecosystems.
                      </p>
                    </div>
                  </div>
                </a>
  
                {/* JoyGift */}
                <a href="/joygift" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-full shadow-lg">
                    <div className="h-48 relative">
                      <img
                        src="/placeholder.svg?height=200&width=400&text=JoyGift"
                        alt="JoyGift"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors mb-3">
                        JoyGift
                      </h3>
                      <p className="text-cosmic-gray font-tech text-sm leading-relaxed">
                        A heartfelt melody on the CKB blockchain, orchestrates a digital red envelope tradition, where
                        users craft and share personalized token-filled tales.
                      </p>
                    </div>
                  </div>
                </a>
  
                {/* Philosopher's Stone */}
                <a href="/philosophers-stone" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-full shadow-lg">
                    <div className="h-48 relative">
                      <img
                        src="/placeholder.svg?height=200&width=400&text=Philosopher's+Stone"
                        alt="Philosopher's Stone"
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          NFT
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                          Game
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors mb-3">
                        Philosopher's Stone
                      </h3>
                      <p className="text-cosmic-gray font-tech text-sm leading-relaxed">
                        An enigmatic protocol on CKB, transmutes the blockchain into a crucible of boundless
                        transformation, where its alchemical essence empowers users to conjure unique digital artifacts.
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </section>
  
          {/* Community-driven Projects */}
          <section className="bg-cosmic-light py-12 px-6 border-t border-cosmic-purple/20">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="h-px w-12 bg-cosmic-purple/50"></div>
                  <h2 className="text-2xl font-future text-cosmic-dark">Community-driven Projects</h2>
                  <div className="h-px w-12 bg-cosmic-purple/50"></div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
                  >
                    <ChevronLeft className="h-5 w-5 text-cosmic-purple" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
                  >
                    <ChevronRight className="h-5 w-5 text-cosmic-purple" />
                  </Button>
                </div>
              </div>
  
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* NervDao */}
                <a href="/nervdao" className="block group">
                  <div className="bg-white rounded-xl p-6 border border-cosmic-purple/20 hover:border-cosmic-purple/50 transition-all duration-300 h-52 shadow-lg">
                    <div className="flex items-start">
                      <div className="h-16 w-16 bg-cosmic-purple/10 rounded-lg flex items-center justify-center border border-cosmic-purple/30 mr-4">
                        <span className="font-future text-cosmic-purple text-xl">ND</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-future text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                          NervDao
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="bg-cosmic-purple/10 text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                            NFT
                          </span>
                          <span className="bg-cosmic-purple/10 text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                            Game
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-cosmic-gray font-tech text-sm mt-4 leading-relaxed">
                      An advanced implementation of the Nervos DAO with enhanced governance features and cross-chain
                      capabilities
                    </p>
                  </div>
                </a>
  
                <div className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-52 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                      <Globe className="h-8 w-8 text-cosmic-purple/70" />
                    </div>
                    <p className="text-cosmic-gray font-tech">Future Community Project</p>
                  </div>
                </div>
  
                <div className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-52 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                      <Globe className="h-8 w-8 text-cosmic-purple/70" />
                    </div>
                    <p className="text-cosmic-gray font-tech">Future Community Project</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Community Fund DAO */}
          <section className="bg-cosmic-light py-12 px-6 border-t border-cosmic-purple/20">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-cosmic-gradient rounded-xl h-52 overflow-hidden border border-cosmic-purple/20 shadow-lg">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-30"></div>
  
                <div className="absolute w-80 h-80 rounded-full bg-cosmic-purple/10 blur-3xl -top-20 -left-20"></div>
                <div className="absolute w-80 h-80 rounded-full bg-cosmic-neonBlue/5 blur-3xl -bottom-20 -right-20"></div>
  
                <div className="absolute w-60 h-60 rounded-full border border-cosmic-purple/20 top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
  
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-4xl md:text-5xl font-future text-cosmic-dark mb-4">
                      Community <span className="text-cosmic-accent">Fund</span> DAO
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px w-12 bg-cosmic-purple/50"></div>
                      <p className="text-cosmic-gray font-tech">Empowering the CKB ecosystem</p>
                      <div className="h-px w-12 bg-cosmic-purple/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
  