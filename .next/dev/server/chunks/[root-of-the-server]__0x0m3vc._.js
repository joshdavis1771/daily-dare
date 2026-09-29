module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/src/app/api/push/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$push$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/server/push.ts [app-route] (ecmascript)");
;
async function manage(request) {
    try {
        const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
        if (!token) return Response.json({
            error: "Sign in required"
        }, {
            status: 401
        });
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$push$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminClient"])();
        const { data: { user }, error } = await db.auth.getUser(token);
        if (error || !user) return Response.json({
            error: "Sign in required"
        }, {
            status: 401
        });
        const raw = await request.text();
        if (raw.length > 4096) return Response.json({
            error: "Subscription too large"
        }, {
            status: 413
        });
        let body;
        try {
            body = JSON.parse(raw);
        } catch  {
            return Response.json({
                error: "Invalid JSON"
            }, {
                status: 400
            });
        }
        if (!body || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$push$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validPushEndpoint"])(body.endpoint)) return Response.json({
            error: "Invalid push endpoint"
        }, {
            status: 400
        });
        if (request.method === "DELETE") {
            const { error } = await db.from("push_subscriptions").delete().eq("endpoint", body.endpoint).eq("user_id", user.id);
            if (error) throw error;
        } else {
            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY || !process.env.VAPID_SUBJECT) return Response.json({
                error: "Notifications are not configured"
            }, {
                status: 503
            });
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$push$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validPushKey"])(body.keys?.p256dh, 65) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$server$2f$push$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validPushKey"])(body.keys?.auth, 16)) return Response.json({
                error: "Invalid push keys"
            }, {
                status: 400
            });
            const { data: existing, error: readError } = await db.from("push_subscriptions").select("user_id").eq("endpoint", body.endpoint).maybeSingle();
            if (readError) throw readError;
            if (existing && existing.user_id !== user.id) return Response.json({
                error: "Unsubscribe this device from its previous account first"
            }, {
                status: 409
            });
            const { count, error: countError } = await db.from("push_subscriptions").select("endpoint", {
                count: "exact",
                head: true
            }).eq("user_id", user.id);
            if (countError) throw countError;
            if (!existing && (count ?? 0) >= 5) return Response.json({
                error: "Device limit reached"
            }, {
                status: 409
            });
            // Updating is scoped to the owner; insert conflicts never reassign an endpoint.
            const value = {
                endpoint: body.endpoint,
                user_id: user.id,
                p256dh: body.keys.p256dh,
                auth: body.keys.auth
            };
            const { error: writeError } = existing ? await db.from("push_subscriptions").update(value).eq("endpoint", body.endpoint).eq("user_id", user.id) : await db.from("push_subscriptions").insert(value);
            if (writeError) throw writeError;
        }
        return Response.json({
            ok: true
        });
    } catch  {
        return Response.json({
            error: "Notifications unavailable"
        }, {
            status: 503
        });
    }
}
const POST = manage;
const DELETE = manage;
}),
"[project]/src/lib/server/push.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminClient",
    ()=>adminClient,
    "validPushEndpoint",
    ()=>validPushEndpoint,
    "validPushKey",
    ()=>validPushKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
function adminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Server configuration unavailable");
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });
}
function validPushEndpoint(endpoint) {
    if (typeof endpoint !== "string" || endpoint.length > 2048) return false;
    try {
        const url = new URL(endpoint);
        return url.protocol === "https:" && !url.username && !url.password && !url.port && (url.hostname === "fcm.googleapis.com" || url.hostname === "updates.push.services.mozilla.com" || url.hostname === "web.push.apple.com" || url.hostname.endsWith(".notify.windows.com"));
    } catch  {
        return false;
    }
}
function validPushKey(value, bytes) {
    if (typeof value !== "string" || !/^[A-Za-z0-9_-]+={0,2}$/.test(value)) return false;
    return Buffer.from(value, "base64url").length === bytes;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0x0m3vc._.js.map