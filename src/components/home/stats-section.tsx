import { getTranslations, getLocale } from "next-intl/server";

function formatCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value);
}

export async function StatsSection() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const STATS = [
    { value: formatNumber(449228, locale), label: t("stats.rareHashesFound") },
    { value: formatCompact(102800000, locale), label: t("stats.zeldInCirculation") },
    { value: "12", label: t("stats.recordZeros") },
    { value: formatCompact(78300000, locale), label: t("stats.utxosTracked") },
  ] as const;

  return (
    <section className="w-full px-6 md:px-12 py-12 border-y border-gold-400/10 bg-black/30">
      <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-semibold text-gold-400 font-mono mb-2">
              {stat.value}
            </div>
            <div className="text-[13px] text-dark-500 uppercase tracking-[1px]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

