import { z } from "zod";

export const factionsSchema = z.enum([
  "universal",
  "garreks-reavers",
  "steelhearts-champions",
  "sepulchral-guard",
  "ironskulls-boyz",
  "the-chosen-axes",
  "spiteclaws-swarm",
  "magores-fiends",
  "the-farstriders", // 8

  // NIGHTVAULT

  "stormsires-cursebreakers", // 9
  "thorns-of-the-briar-queen", // 10
  "the-eyes-of-the-nine", // 11
  "zarbags-gitz", // 12
  "godsworn-hunt", // 13
  "mollogs-mob", // 14
  "thundriks-profiteers", // 15
  "yltharis-guardians", // 16

  // DREADFANE

  "ironsouls-condemners", // 17
  "lady-harrows-mournflight", // 18

  // BEASTGRAVE

  "grashraks-despoilers", // 19
  "skaeths-wild-hunt", // 20
  "the-grymwatch", // 21
  "rippas-snarlfangs", // 22
  "hrothgorns-mantrappers", // 23
  "the-wurmspat", // 24
  "morgwaeths-blade-coven", // 25
  "morgoks-krushas", // 26

  "myaris-purifiers", // 27
  "dread-pageant", // 28
  "khagras-ravagers", // 29
  "the-starblood-stalkers", // 30
  "the-crimson-court", // 31
  "hedkrakkas-madmob", // 32
  "kainans-reapers", //
  "elathains-soulreapers", // 30
  "storm-of-celestus", // 30
  "drepurs-wraithcreepers", // 30

  "grand-aliance-order",
  "grand-aliance-chaos",
  "grand-aliance-death",
  "grand-aliance-destruction",
  "xandires-truthseekers",
  "da-kunnin-krew",
  "blackpowders-buccaneers",
  "the-exiled-dead",
  "skittershanks-clawpack",
  "the-shadeborn",
  "hexbanes-hunters",
  "gorechosen-of-dromm",
  "gnarlspirit-pack",
  "sons-of-velmorn",
  "grinkraks-looncourt",
  "gryselles-arenai",

  "domitans-stormcoven",
  "ephilims-pandaemonium",
  "the-headsmens-curse",
  "skabbiks-plaguepack",
  "cyrenis-razors",
  "the-thricefold-discord",
  "daggoks-stab-ladz",
  "zondaras-gravebreakers",
  "brethren-of-the-bolt",
  "the-skinnerkin",
]);

export type Factions = z.infer<typeof factionsSchema>;
