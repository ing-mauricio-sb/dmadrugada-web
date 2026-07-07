import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/home/Hero";
import { Manifiesto } from "@/components/home/Manifiesto";
import { RelojMadrugada } from "@/components/home/RelojMadrugada";
import { AntojosSequence } from "@/components/home/AntojosSequence";
import { MarqueeSabores } from "@/components/home/MarqueeSabores";
import { ComoPedir } from "@/components/home/ComoPedir";
import { CtaFinal } from "@/components/home/CtaFinal";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Hero />
      <Manifiesto />
      <RelojMadrugada />
      <AntojosSequence />
      <MarqueeSabores />
      <ComoPedir />
      <CtaFinal />
    </>
  );
}
