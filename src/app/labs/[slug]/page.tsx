import { notFound } from "next/navigation";
import { LABS } from "@/data/labs";
import LabClientRunner from "./LabClientRunner";

export function generateStaticParams() {
  return LABS.map((lab) => ({
    slug: lab.slug,
  }));
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const labMeta = LABS.find((l) => l.slug === slug);

  if (!labMeta) {
    notFound();
  }

  return <LabClientRunner labMeta={labMeta} />;
}

