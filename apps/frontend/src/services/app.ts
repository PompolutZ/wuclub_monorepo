export declare const app: import("hono/hono-base").HonoBase<{}, {
    "/v2/*": {};
} | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                fuid: string;
                avatar: string;
                displayName: string;
                role?: string[] | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                fuid: string;
                role: string[];
                displayName: string;
                avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/": {
        $put: {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                fuid: string;
                displayName: string;
                avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/decks": {
        $get: {
            input: {};
            output: {
                [x: string]: any;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/v2/users"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    faction?: string | string[] | undefined;
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                    edition?: string | string[] | undefined;
                };
            };
            output: never[] | {
                decks: {
                    [x: string]: any;
                }[];
                total: any;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                deckId: string;
                deck: number[];
                faction: string;
                name: string;
                private: boolean;
                sets: string[];
                fuid: string;
                createdutc: number;
                updatedutc: number;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    deckId: string;
                    deck: number[];
                    faction: string;
                    name: string;
                    private: boolean;
                    sets: string[];
                };
            };
            output: {
                status: number;
                data: {
                    acknowledged: boolean;
                    insertedId: string;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/:id": {
        $put: {
            input: {
                json: {
                    deckId?: string | undefined;
                    deck?: number[] | undefined;
                    faction?: string | undefined;
                    name?: string | undefined;
                    private?: boolean | undefined;
                    sets?: string[] | undefined;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                [x: string]: any;
                _id: string;
            } | null;
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                deletedCount: number;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/v2/decks"> | import("hono/types").MergeSchemaPath<{
    "/decks": {
        $get: {
            input: {};
            output: {
                faction: import("@fxdxpz/schema").Factions;
                count: number;
            }[];
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/v2/stats">, "/v2">;
export type AppRoutes = typeof app;
