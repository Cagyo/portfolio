import { GolfTournamentIcon } from "@/assets/icons/GolfTournamentIcon"
import { GolfFlagIcon } from "@/assets/icons/GolfFlagIcon"
import { GolfSocialIcon } from "@/assets/icons/GolfSocialIcon"
import { GolfersIcon } from "@/assets/icons/GolfersIcon"
import { GolfBookingIcon } from "@/assets/icons/GolfBookingIcon"
import { SmartphoneWithFlagIcon } from "@/assets/icons/SmartphoneWithFlagIcon"
import { CurrencyExchangeIcon } from "@/assets/icons/CurrencyExchangeIcon"
import { MoneyExchangeIcon } from "@/assets/icons/MoneyExchangeIcon"
import { CarWashIcon } from "@/assets/icons/CarWashIcon"
import { MapPinIcon } from "@/assets/icons/MapPinIcon"

export const HOME_PROJECT_IDS = [1, 2, 3, 6, 4] as const

type ProjectVisual = {
  icon: React.ReactNode
  imageContent: React.ReactNode
  imageBg: string
}

export function getHomeProjectVisual(id: number): ProjectVisual | undefined {
  switch (id) {
    case 1:
      return {
        icon: <GolfTournamentIcon className="w-3.5 h-3.5 text-amber-500" />,
        imageBg: "bg-gradient-to-br from-red-900/40 via-red-800/20 to-transparent",
        imageContent: (
          <>
            <div className="w-44 h-44 rounded-full bg-red-500/15 blur-3xl" />
            <GolfFlagIcon className="absolute w-20 h-20 text-red-400" strokeWidth={1.5} fillOpacity={0.3} />
          </>
        ),
      }
    case 2:
      return {
        icon: <GolfSocialIcon className="w-3.5 h-3.5 text-amber-500" />,
        imageBg: "bg-gradient-to-br from-green-900/30 to-transparent",
        imageContent: (
          <>
            <div className="w-44 h-44 rounded-full bg-green-500/15 blur-3xl" />
            <GolfersIcon className="absolute w-32 h-24 text-green-400/60" />
          </>
        ),
      }
    case 3:
      return {
        icon: <GolfBookingIcon className="w-3.5 h-3.5 text-amber-500" />,
        imageBg: "bg-gradient-to-br from-emerald-900/30 to-transparent",
        imageContent: (
          <>
            <div className="w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
            <SmartphoneWithFlagIcon className="absolute w-20 h-20 text-emerald-400/60 rotate-12" strokeWidth={1.5} />
          </>
        ),
      }
    case 6:
      return {
        icon: <CurrencyExchangeIcon className="w-3.5 h-3.5 text-amber-500" />,
        imageBg: "bg-gradient-to-br from-indigo-900/30 to-transparent",
        imageContent: (
          <>
            <div className="w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />
            <MoneyExchangeIcon className="absolute w-16 h-16 text-indigo-400/65" strokeWidth={1.5} />
          </>
        ),
      }
    case 4:
      return {
        icon: <CarWashIcon className="w-3.5 h-3.5 text-amber-500" />,
        imageBg: "bg-gradient-to-br from-sky-900/30 to-transparent",
        imageContent: (
          <>
            <div className="w-44 h-44 rounded-full bg-sky-500/15 blur-3xl" />
            <MapPinIcon className="absolute w-16 h-16 text-sky-400/70" />
          </>
        ),
      }
    default:
      return undefined
  }
}
