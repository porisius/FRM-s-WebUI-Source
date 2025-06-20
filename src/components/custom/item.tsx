import Image from "next/image";

type ItemProps = {
  icon: string;
  count: number;
  color: string;
};

export function Item({ icon, count, color }: ItemProps) {
  return (
    <div
      className={`size-16 border rounded-md relative overflow-hidden`}
      style={{
        backgroundColor: `hsla(${color},0.4)`,
        color: `hsl(${color})`,
        borderColor: `hsl(${color})`,
      }}
    >
      <Image
        src={icon}
        alt="Item Icon"
        width={56}
        height={56}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <p
        className={`absolute right-0 bottom-0 text-xs font-semibold border-t border-l bg-card rounded-tl-md px-2`}
        style={{
          color: `hsl(${color})`,
          borderColor: `hsl(${color})`,
        }}
      >
        {count}
      </p>
    </div>
  );
}
