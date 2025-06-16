import Image from "next/image";

type ItemProps = {
  icon: string;
  count: number;
  color?: string;
};

export function Item({ icon, count, color }: ItemProps) {
  const hasColor = !!color;
  const background = hasColor ? `bg-[hsla(${color},0.4)]` : "bg-card";
  const border = hasColor ? `border-[hsl(${color})]` : "border";
  const text = hasColor ? `text-[hsl(${color})]` : "";

  return (
    <div
      className={`size-16 ${background} border ${border} rounded-md relative overflow-hidden`}
    >
      <Image
        src={icon}
        alt="Item Icon"
        width={56}
        height={56}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <p
        className={`absolute right-0 bottom-0 text-xs font-semibold ${text} border-t border-l ${border} bg-card rounded-tl-md px-2`}
      >
        {count}
      </p>
    </div>
  );
}
