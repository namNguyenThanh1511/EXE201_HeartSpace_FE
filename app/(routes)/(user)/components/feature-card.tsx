import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export default function FeatureCard({
  image,
  title,
  description,
  buttonText,
  link,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center">
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        className="size-48 mb-6 object-contain"
      />
      <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6 text-xs md:text-sm">{description}</p>
      <Link href={link}>
        <Button className="rounded-full bg-red-600 text-white hover:bg-red-700 max-md:text-xs">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
