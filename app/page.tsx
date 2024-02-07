import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "react-bootstrap-icons";
import datastaxLogo from "../assets/datastax-logo.png";


export default function Home() {

  return (
    <main className="clothing-background h-full">
      <div className="flex flex-col h-full p-6">
        <div className="grow flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-6">Fashion, Meet AI.</h1>
          <p className="text-xl">Say goodbye to wardrobe dilemmas and hello to effortless style.</p>
        </div>
        <div>
          <div className="pb-6">
            <span>Powered by</span>
            <Image className="mt-2" src={datastaxLogo} alt="DataStax Logo" height={16} width={172} />
          </div>

          <Link href="/upload">
            <button className="slime-background flex items-center justify-center gap-2 w-full rounded-full p-4 text-lg font-semibold">
                Get started
                <ArrowRight />
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}