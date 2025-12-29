"use client";

import {Button} from "@/components/ui";
import {useTranslations} from "next-intl";

export function ExplorerHeader() {
  const t = useTranslations("common");

  return (
    <section className="w-full px-6 md:px-12 pt-6 pb-10 border-b border-gold-400/10 bg-black/30">
      <div className="max-w-[900px] mx-auto space-y-6">
        <h1 className="text-[clamp(40px,7vw,64px)] font-light leading-[1.1] tracking-[-1.5px] font-serif">
          {t("explorer.title")}
        </h1>
        <div className="max-w-[720px]">
          <label htmlFor="explorer-search" className="sr-only">
            {t("explorer.searchLabel")}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="explorer-search"
              type="text"
              placeholder={t("explorer.searchPlaceholder")}
              className="flex-1 rounded-lg border border-gold-400/20 bg-white/[0.03] px-4 py-3 text-base text-dark-100 placeholder:text-dark-500 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
              aria-describedby="explorer-search-help"
            />
            <Button type="button" className="sm:w-auto w-full" variant="secondary">
              {t("explorer.searchButton")}
            </Button>
          </div>
          <p id="explorer-search-help" className="mt-3 text-sm text-dark-500">
            {t("explorer.searchHelp")}
          </p>
        </div>
      </div>
    </section>
  );
}

