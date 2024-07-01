export declare const app: import("hono/hono-base").HonoBase<import("hono/types").BlankEnv, {
    "/v2/decks": {
        $get: {
            input: {
                query: {
                    faction?: string | string[] | undefined;
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                };
            };
            output: {
                data: {
                    [x: string]: any;
                }[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                query: {
                    faction?: string | string[] | undefined;
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
        $post: {
            input: {
                json: {
                    deckId: string;
                    deck: number[];
                    name: string;
                    private: boolean;
                    sets: number[];
                    createdutc: number;
                    updatedutc: number;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                json: {
                    deckId: string;
                    deck: number[];
                    name: string;
                    private: boolean;
                    sets: number[];
                    createdutc: number;
                    updatedutc: number;
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
    "/v2/decks/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                data: {
                    deckId: string;
                    fuid: string;
                    deck: number[];
                    faction: string;
                    name: string;
                    private: boolean;
                    sets: number[];
                    createdutc: number;
                    updatedutc: number;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
        $put: {
            input: {
                json: {
                    deck: number[];
                    name: string;
                    private: boolean;
                    sets: number[];
                    updatedutc: number;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                json: {
                    deck: number[];
                    name: string;
                    private: boolean;
                    sets: number[];
                    updatedutc: number;
                };
            } & {
                param: {
                    id: string;
                };
            };
            output: {
                data: {
                    [x: string]: any;
                    _id: string;
                } | null;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                data: {
                    deletedCount: number;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
} & {
    "/v2/users": {
        $get: {
            input: {};
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {};
            output: {
                data: {
                    fuid: string;
                    avatar: string;
                    displayName: string;
                    role?: string[] | undefined;
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
        $post: {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                data: {
                    fuid: string;
                    role: string[];
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
        $put: {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                data: {
                    fuid: string;
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                json: {
                    displayName: string;
                    avatar: "universal" | "garreks-reavers" | "steelhearts-champions" | "sepulchral-guard" | "ironskulls-boyz" | "the-chosen-axes" | "spiteclaws-swarm" | "magores-fiends" | "the-farstriders" | "stormsires-cursebreakers" | "thorns-of-the-briar-queen" | "the-eyes-of-the-nine" | "zarbags-gitz" | "godsworn-hunt" | "mollogs-mob" | "thundriks-profiteers" | "yltharis-guardians" | "ironsouls-condemners" | "lady-harrows-mournflight" | "grashraks-despoilers" | "skaeths-wild-hunt" | "the-grymwatch" | "rippas-snarlfangs" | "hrothgorns-mantrappers" | "the-wurmspat" | "morgwaeths-blade-coven" | "morgoks-krushas" | "myaris-purifiers" | "dread-pageant" | "khagras-ravagers" | "the-starblood-stalkers" | "the-crimson-court" | "hedkrakkas-madmob" | "kainans-reapers" | "elathains-soulreapers" | "storm-of-celestus" | "drepurs-wraithcreepers" | "grand-aliance-order" | "grand-aliance-chaos" | "grand-aliance-death" | "grand-aliance-destruction" | "xandires-truthseekers" | "da-kunnin-krew" | "blackpowders-buccaneers" | "the-exiled-dead" | "skittershanks-clawpack" | "the-shadeborn" | "hexbanes-hunters" | "gorechosen-of-dromm" | "gnarlspirit-pack" | "sons-of-velmorn" | "grinkraks-looncourt" | "gryselles-arenai" | "domitans-stormcoven" | "ephilims-pandaemonium" | "the-headsmens-curse" | "skabbiks-plaguepack" | "cyrenis-razors" | "the-thricefold-discord" | "daggoks-stab-ladz" | "zondaras-gravebreakers" | "brethren-of-the-bolt" | "the-skinnerkin";
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
    "/v2/users/decks": {
        $get: {
            input: {
                query: {
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                };
            };
            output: {
                data: {
                    [x: string]: any;
                }[];
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        } | {
            input: {
                query: {
                    skip?: string | string[] | undefined;
                    limit?: string | string[] | undefined;
                };
            };
            output: {
                status: number;
                error: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").StatusCode;
        };
    };
}, "/v2">;
export type AppRoutes = typeof app;
