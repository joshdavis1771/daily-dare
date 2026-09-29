module.exports = [
"[project]/src/app/messages/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessagesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/app-shell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demo-data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const sharedMessagesKey = "daily-dare-shared-messages-v1";
const reactionOptions = [
    "❤️",
    "😂",
    "👏",
    "✨"
];
function loadThreads() {
    if ("TURBOPACK compile-time truthy", 1) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoMessages"];
    //TURBOPACK unreachable
    ;
}
function MessagesPage() {
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [threads, setThreads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoMessages"]);
    const [reactions, setReactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const selectedThread = threads.find((thread)=>thread.id === selectedId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startTransition"])(()=>setThreads(loadThreads()));
        const refresh = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["startTransition"])(()=>setThreads(loadThreads()));
        window.addEventListener("daily-dare-messages-updated", refresh);
        return ()=>window.removeEventListener("daily-dare-messages-updated", refresh);
    }, []);
    function sendMessage(event) {
        event.preventDefault();
        const body = draft.trim();
        if (!body) return;
        setThreads((current)=>current.map((thread)=>thread.id === selectedId ? {
                    ...thread,
                    messages: [
                        ...thread.messages,
                        {
                            body,
                            fromMe: true,
                            createdAt: "now"
                        }
                    ]
                } : thread));
        setDraft("");
    }
    function toggleReaction(messageKey, reaction) {
        setReactions((current)=>{
            const selected = current[messageKey] ?? [];
            const next = selected.includes(reaction) ? selected.filter((item)=>item !== reaction) : [
                ...selected,
                reaction
            ];
            return {
                ...current,
                [messageKey]: next
            };
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppShell"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-4xl px-5 pb-32 pt-10 lg:px-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs font-black uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300",
                    children: "little sparks, shared"
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "font-display mt-2 text-3xl font-black tracking-[-0.07em]",
                    children: "Messages"
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 grid overflow-hidden rounded-[1.5rem] border border-[#171717]/10 bg-white dark:border-neutral-700 dark:bg-neutral-800 md:grid-cols-[minmax(15rem,0.8fr)_1.2fr] md:min-h-[34rem]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: `border-b border-[#171717]/10 dark:border-neutral-700 md:border-b-0 md:border-r ${selectedThread ? "hidden md:block" : "block"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-b border-[#171717]/10 px-5 py-4 dark:border-neutral-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-bold",
                                            children: "Your people"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-[#171717]/50 dark:text-neutral-400",
                                            children: "Send a little sunshine."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2",
                                    children: threads.map((thread)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSelectedId(thread.id),
                                            className: `flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${thread.id === selectedId ? "bg-teal-50 dark:bg-teal-950" : "hover:bg-neutral-50 dark:hover:bg-neutral-700"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: thread.avatarUrl,
                                                    alt: "",
                                                    width: 44,
                                                    height: 44,
                                                    unoptimized: true,
                                                    className: "h-11 w-11 rounded-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 106,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "min-w-0 flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            className: "block truncate text-sm",
                                                            children: thread.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/messages/page.tsx",
                                                            lineNumber: 115,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block truncate text-xs text-[#171717]/50 dark:text-neutral-400",
                                                            children: thread.messages.at(-1)?.body
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/messages/page.tsx",
                                                            lineNumber: 118,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] text-[#171717]/40 dark:text-neutral-500",
                                                    children: thread.messages.at(-1)?.createdAt
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, thread.id, true, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 100,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        selectedThread ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "block",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 border-b border-[#171717]/10 px-5 py-4 dark:border-neutral-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSelectedId(""),
                                            className: "grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 md:hidden",
                                            "aria-label": "Back to conversations",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/messages/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: selectedThread.avatarUrl,
                                            alt: "",
                                            width: 40,
                                            height: 40,
                                            unoptimized: true,
                                            className: "h-10 w-10 rounded-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "block text-sm",
                                                    children: selectedThread.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-[#171717]/50 dark:text-neutral-400",
                                                    children: [
                                                        "@",
                                                        selectedThread.username
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex min-h-[24rem] flex-col justify-end gap-3 p-5",
                                    children: selectedThread.messages.map((message, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.fromMe ? "self-end rounded-br-sm bg-teal-700 text-white" : "rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    children: message.body
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 21
                                                }, this),
                                                message.sharedPost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: message.sharedPost.profileUrl,
                                                    className: "mt-3 block overflow-hidden rounded-2xl bg-white/15 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-teal-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            src: message.sharedPost.posterUrl,
                                                            alt: `${message.sharedPost.challengeTitle} preview`,
                                                            width: 640,
                                                            height: 360,
                                                            loading: "eager",
                                                            unoptimized: true,
                                                            className: "aspect-[16/9] w-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/messages/page.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] font-bold uppercase tracking-[0.14em] opacity-70",
                                                                    children: "Shared dare"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                                    lineNumber: 179,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 font-semibold",
                                                                    children: message.sharedPost.challengeTitle
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                                    lineNumber: 182,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-xs opacity-80",
                                                                    children: [
                                                                        "@",
                                                                        message.sharedPost.creatorUsername,
                                                                        " · ",
                                                                        message.sharedPost.caption
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                                    lineNumber: 185,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/messages/page.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `mt-1 block text-[10px] ${message.fromMe ? "text-teal-100" : "text-neutral-400"}`,
                                                    children: message.createdAt
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 flex flex-wrap gap-1",
                                                    children: reactionOptions.map((reaction)=>{
                                                        const messageKey = `${selectedThread.id}:${index}`;
                                                        const selected = reactions[messageKey]?.includes(reaction);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>toggleReaction(messageKey, reaction),
                                                            "aria-label": `${selected ? "Remove" : "Add"} ${reaction} reaction`,
                                                            "aria-pressed": selected,
                                                            className: `rounded-full px-2 py-1 text-xs transition ${selected ? "bg-white text-neutral-900" : "bg-white/15 hover:bg-white/30"}`,
                                                            children: [
                                                                reaction,
                                                                selected ? " 1" : ""
                                                            ]
                                                        }, reaction, true, {
                                                            fileName: "[project]/src/app/messages/page.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, `${message.createdAt}-${index}`, true, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 159,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: sendMessage,
                                    className: "flex items-center gap-2 border-t border-[#171717]/10 p-4 dark:border-neutral-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: draft,
                                            onChange: (event)=>setDraft(event.target.value),
                                            placeholder: `Message ${selectedThread.name.split(" ")[0]}`,
                                            "aria-label": "Message",
                                            className: "min-w-0 flex-1 rounded-xl bg-neutral-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:bg-neutral-700"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 221,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            "aria-label": "Send message",
                                            className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:opacity-40",
                                            disabled: !draft.trim(),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/messages/page.tsx",
                                                lineNumber: 234,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 228,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 130,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden min-h-[34rem] place-items-center p-8 text-center text-sm text-[#171717]/50 dark:text-neutral-400 md:grid",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Select a conversation to start a little spark."
                            }, void 0, false, {
                                fileName: "[project]/src/app/messages/page.tsx",
                                lineNumber: 240,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 239,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/messages/page.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/messages/page.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/app-shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/archive.mjs [app-ssr] (ecmascript) <export default as Archive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/crown.mjs [app-ssr] (ecmascript) <export default as Crown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.mjs [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.mjs [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.mjs [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.mjs [app-ssr] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/plus-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notifications.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const navItems = [
    {
        href: "/",
        label: "Today",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        href: "/search",
        label: "People",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"]
    },
    {
        href: "/messages",
        label: "Messages",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"]
    },
    {
        href: "/archive",
        label: "Memories",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$archive$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Archive$3e$__["Archive"]
    },
    {
        href: "/profile",
        label: "Profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"]
    }
];
function AppShell({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const plusState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePlus"])();
    const touchStartY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pullDistance, setPullDistance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [refreshing, setRefreshing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasUnreadNotifications, setHasUnreadNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const refreshNotifications = ()=>setHasUnreadNotifications((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["readNotifications"])().some((notification)=>!notification.read));
        refreshNotifications();
        window.addEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notificationsEvent"], refreshNotifications);
        return ()=>window.removeEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notificationsEvent"], refreshNotifications);
    }, []);
    async function openProfile(event) {
        event.preventDefault();
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSupabaseConfigured"] || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"]) {
            router.push("/profile");
            return;
        }
        const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        router.push(session ? "/profile" : "/auth");
    }
    function handleTouchStart(event) {
        if (window.scrollY === 0) touchStartY.current = event.touches[0]?.clientY ?? null;
    }
    function handleTouchMove(event) {
        if (touchStartY.current === null || refreshing) return;
        const distance = Math.min(96, Math.max(0, (event.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current) * 0.5);
        setPullDistance(distance);
    }
    function handleTouchEnd() {
        if (touchStartY.current === null) return;
        if (pullDistance >= 56) {
            setRefreshing(true);
            window.location.reload();
            return;
        }
        touchStartY.current = null;
        setPullDistance(0);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-100",
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        children: [
            (pullDistance > 0 || refreshing) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-white p-2 text-teal-700 shadow-lg dark:bg-neutral-800 dark:text-teal-300",
                style: {
                    transform: `translate(-50%, ${Math.min(72, pullDistance)}px)`
                },
                "aria-live": "polite",
                "aria-label": refreshing ? "Refreshing page" : "Release to refresh",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    size: 18,
                    className: refreshing ? "animate-spin" : ""
                }, void 0, false, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 60,
                    columnNumber: 373
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 60,
                columnNumber: 44
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto grid h-20 max-w-xl grid-cols-[1fr_auto_1fr] items-center px-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/search",
                                className: "grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300",
                                "aria-label": "Find people",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    size: 21
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 63,
                                    columnNumber: 260
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/app-shell.tsx",
                                lineNumber: 63,
                                columnNumber: 52
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex min-h-11 w-36 items-center justify-center sm:w-44",
                            "aria-label": "Daily Dare home",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: plusState.enabled ? "/brand/daily-dare-light-plus.png" : "/brand/daily-dare-light-v2.png",
                                    alt: "Daily Dare",
                                    width: 1647,
                                    height: 362,
                                    unoptimized: true,
                                    className: "h-auto w-full dark:hidden"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: plusState.enabled ? "/brand/daily-dare-dark-plus.png" : "/brand/daily-dare-dark-v2.png",
                                    alt: "Daily Dare",
                                    width: 1647,
                                    height: 362,
                                    unoptimized: true,
                                    className: "hidden h-auto w-full dark:block"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-end gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/plus",
                                    "aria-current": pathname === "/plus" ? "page" : undefined,
                                    className: `flex h-10 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors sm:px-3 ${pathname === "/plus" ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" : "text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950"}`,
                                    "aria-label": "Open Daily Dare Plus",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$crown$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Crown$3e$__["Crown"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/app-shell.tsx",
                                            lineNumber: 68,
                                            columnNumber: 458
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden sm:inline",
                                            children: "Plus"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/app-shell.tsx",
                                            lineNumber: 68,
                                            columnNumber: 477
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 68,
                                    columnNumber: 64
                                }, this),
                                pathname === "/profile" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/settings",
                                    className: "grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300",
                                    "aria-label": "Open settings",
                                    title: "Settings",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/app-shell.tsx",
                                        lineNumber: 68,
                                        columnNumber: 787
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 68,
                                    columnNumber: 558
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/notifications",
                                    className: "relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300",
                                    "aria-label": "Open notifications",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/app-shell.tsx",
                                            lineNumber: 68,
                                            columnNumber: 1048
                                        }, this),
                                        hasUnreadNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/app-shell.tsx",
                                            lineNumber: 68,
                                            columnNumber: 1093
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 68,
                                    columnNumber: 817
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                "aria-label": "Main navigation",
                className: "fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-xl items-center justify-around px-5",
                    children: navItems.map(({ href, label, icon: Icon })=>{
                        const active = pathname === href;
                        const linkClass = `flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition ${active ? "bg-teal-50 dark:bg-teal-950 font-semibold text-teal-700 dark:text-teal-300" : "text-neutral-500 dark:text-neutral-300 hover:text-teal-700 dark:hover:text-teal-300"}`;
                        return href === "/profile" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/auth",
                            onClick: openProfile,
                            "aria-current": active ? "page" : undefined,
                            className: linkClass,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: 21,
                                    strokeWidth: active ? 2.4 : 1.7
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 77,
                                    columnNumber: 156
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 77,
                                    columnNumber: 207
                                }, this)
                            ]
                        }, href, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 77,
                            columnNumber: 42
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: href,
                            "aria-current": active ? "page" : undefined,
                            className: linkClass,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    size: 21,
                                    strokeWidth: active ? 2.4 : 1.7
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 77,
                                    columnNumber: 328
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 77,
                                    columnNumber: 379
                                }, this)
                            ]
                        }, href, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 77,
                            columnNumber: 234
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/app-shell.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/app-shell.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/demo-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "challenges",
    ()=>challenges,
    "demoComments",
    ()=>demoComments,
    "demoMessages",
    ()=>demoMessages,
    "demoPosts",
    ()=>demoPosts,
    "demoProfiles",
    ()=>demoProfiles,
    "getDailyChallengeForUser",
    ()=>getDailyChallengeForUser,
    "todayChallenge",
    ()=>todayChallenge,
    "todaysChallenges",
    ()=>todaysChallenges
]);
const demoProfiles = [
    {
        id: "p1",
        username: "dailydare",
        displayName: "Daily Dare",
        bio: "Tiny rituals, big energy. ✨",
        avatarUrl: "/icons/daily-dare-new.png",
        followers: 1280,
        following: 184,
        isFollowing: true
    },
    {
        id: "p2",
        username: "alexafterhours",
        displayName: "Alex Rivera",
        bio: "Finding the fun in showing up.",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
        followers: 842,
        following: 231,
        streak: 8,
        isFollowing: true,
        isPlus: true
    },
    {
        id: "p3",
        username: "jordan.joy",
        displayName: "Jordan Brooks",
        bio: "Good days are built, not found.",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
        followers: 2190,
        following: 96,
        streak: 21
    },
    {
        id: "p4",
        username: "sunday.sage",
        displayName: "Sage Williams",
        bio: "Soft mornings and brave tries.",
        avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
        followers: 516,
        following: 143,
        streak: 4
    }
];
const demoMessages = [
    {
        id: "thread-maya",
        name: demoProfiles[0].displayName,
        username: demoProfiles[0].username,
        avatarUrl: demoProfiles[0].avatarUrl,
        messages: [
            {
                body: "That commute dare was exactly what I needed today.",
                fromMe: false,
                createdAt: "12 min ago"
            },
            {
                body: "The tiny shoulder shimmy made my whole morning.",
                fromMe: true,
                createdAt: "8 min ago"
            }
        ]
    },
    {
        id: "thread-alex",
        name: demoProfiles[1].displayName,
        username: demoProfiles[1].username,
        avatarUrl: demoProfiles[1].avatarUrl,
        messages: [
            {
                body: "Are you doing today’s five-second groove?",
                fromMe: false,
                createdAt: "34 min ago"
            }
        ]
    },
    {
        id: "thread-jordan",
        name: demoProfiles[2].displayName,
        username: demoProfiles[2].username,
        avatarUrl: demoProfiles[2].avatarUrl,
        messages: [
            {
                body: "Your long way home post made me want to wander.",
                fromMe: false,
                createdAt: "1 hr ago"
            }
        ]
    },
    {
        id: "thread-sage",
        name: demoProfiles[3].displayName,
        username: demoProfiles[3].username,
        avatarUrl: demoProfiles[3].avatarUrl,
        messages: [
            {
                body: "Soft mornings and brave tries.",
                fromMe: false,
                createdAt: "2 hr ago"
            }
        ]
    }
];
const todaysChallenges = [
    {
        id: "c-today",
        title: "Make your ordinary iconic",
        instructions: "Turn one everyday moment into a 10-second celebration. Add a move, a grin, or a dramatic reveal.",
        category: "Joy",
        difficulty: "gentle",
        date: "2026-09-16",
        accent: "coral"
    },
    {
        id: "c-today-2",
        title: "Find your five-second groove",
        instructions: "Add a tiny dance break to something you already do today. Keep it joyful and unmistakably yours.",
        category: "Movement",
        difficulty: "steady",
        date: "2026-09-16",
        accent: "blue"
    },
    {
        id: "c-today-3",
        title: "Send a little sunshine",
        instructions: "Send someone a kind message and show us the moment you hit send.",
        category: "People",
        difficulty: "gentle",
        date: "2026-09-16",
        accent: "yellow"
    },
    {
        id: "c-today-4",
        title: "Make the ordinary delicious",
        instructions: "Turn a snack, drink, or meal into a tiny ceremony worthy of a close-up.",
        category: "Ritual",
        difficulty: "bold",
        date: "2026-09-16",
        accent: "mint"
    }
];
const todayChallenge = todaysChallenges[0];
const challenges = [
    ...todaysChallenges,
    {
        id: "c-1",
        title: "Take the scenic route",
        instructions: "Walk somewhere you usually rush past and show us what you notice.",
        category: "Outside",
        difficulty: "steady",
        date: "2026-09-15",
        accent: "blue"
    },
    {
        id: "c-2",
        title: "Compliment in public",
        instructions: "Give someone a sincere compliment and capture your reaction after.",
        category: "People",
        difficulty: "bold",
        date: "2026-09-14",
        accent: "yellow"
    },
    {
        id: "c-3",
        title: "Five-minute reset",
        instructions: "Reset one tiny corner of your world. Before, after, and one proud nod.",
        category: "Home",
        difficulty: "gentle",
        date: "2026-09-13",
        accent: "mint"
    }
];
const demoChallengeAssignments = {
    [demoProfiles[0].id]: todaysChallenges[0],
    [demoProfiles[1].id]: todaysChallenges[1],
    [demoProfiles[2].id]: todaysChallenges[2],
    [demoProfiles[3].id]: todaysChallenges[3]
};
function getDailyChallengeForUser(userId) {
    const assignedDemoChallenge = demoChallengeAssignments[userId];
    if (assignedDemoChallenge) return assignedDemoChallenge;
    let hash = 0;
    for (const character of userId)hash = hash * 31 + character.charCodeAt(0) >>> 0;
    return todaysChallenges[hash % todaysChallenges.length];
}
const demoPosts = [
    {
        id: "post-1",
        creator: demoProfiles[0],
        challenge: getDailyChallengeForUser(demoProfiles[0].id),
        caption: "My commute has entered its main character era. #joy #dailyritual",
        mediaType: "photo",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
        posterUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
        likes: 248,
        comments: 18,
        liked: false,
        createdAt: "12 min ago"
    },
    {
        id: "post-2",
        creator: demoProfiles[1],
        challenge: getDailyChallengeForUser(demoProfiles[1].id),
        caption: "Proof that the grocery aisle can be a stage. @maya.moves #smallwins",
        mediaType: "photo",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
        posterUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
        likes: 91,
        comments: 7,
        liked: true,
        createdAt: "34 min ago"
    },
    {
        id: "post-3",
        creator: demoProfiles[2],
        challenge: getDailyChallengeForUser(demoProfiles[2].id),
        caption: "Took the long way home and found a whole new block. #outside #notice",
        mediaType: "photo",
        photoUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
        posterUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
        likes: 403,
        comments: 29,
        liked: false,
        createdAt: "1 hr ago"
    }
];
const demoComments = {
    "post-1": [
        {
            id: "comment-1",
            author: demoProfiles[2],
            body: "The tiny shoulder shimmy! 10/10.",
            createdAt: "8 min ago",
            likes: 12
        }
    ],
    "post-2": [
        {
            id: "comment-2",
            author: demoProfiles[0],
            body: "The grocery aisle really is a stage when you commit to it.",
            createdAt: "25 min ago",
            likes: 8
        }
    ],
    "post-3": [
        {
            id: "comment-3",
            author: demoProfiles[1],
            body: "This made me want to take the long way home too.",
            createdAt: "42 min ago",
            likes: 15
        }
    ]
};
}),
"[project]/src/lib/notifications.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addLikeNotification",
    ()=>addLikeNotification,
    "markNotificationRead",
    ()=>markNotificationRead,
    "markNotificationsRead",
    ()=>markNotificationsRead,
    "notificationsEvent",
    ()=>notificationsEvent,
    "readNotifications",
    ()=>readNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demo-data.ts [app-ssr] (ecmascript)");
;
const notificationsKey = "daily-dare-notifications-v1";
const notificationsEvent = "daily-dare-notifications-updated";
const defaultNotifications = [
    {
        id: "notification-alex-like",
        type: "like",
        actor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoProfiles"][1],
        postId: "post-1",
        postCaption: "My commute has entered its main character era.",
        createdAt: "12 min ago",
        read: false
    },
    {
        id: "notification-jordan-like",
        type: "like",
        actor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoProfiles"][2],
        postId: "post-1",
        postCaption: "My commute has entered its main character era.",
        createdAt: "1 hr ago",
        read: true
    }
];
function readNotifications() {
    if ("TURBOPACK compile-time truthy", 1) return defaultNotifications;
    //TURBOPACK unreachable
    ;
}
function writeNotifications(notifications) {
    window.localStorage.setItem(notificationsKey, JSON.stringify(notifications));
    window.dispatchEvent(new Event(notificationsEvent));
}
function addLikeNotification(postCaption, postId) {
    const notifications = readNotifications();
    const actor = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["demoProfiles"][1];
    writeNotifications([
        {
            id: `notification-${Date.now()}`,
            type: "like",
            actor,
            postId,
            postCaption,
            createdAt: "now",
            read: false
        },
        ...notifications
    ]);
}
function markNotificationRead(id) {
    writeNotifications(readNotifications().map((notification)=>notification.id === id ? {
            ...notification,
            read: true
        } : notification));
}
function markNotificationsRead() {
    writeNotifications(readNotifications().map((notification)=>({
            ...notification,
            read: true
        })));
}
}),
"[project]/src/lib/plus-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readPlus",
    ()=>readPlus,
    "updatePlus",
    ()=>updatePlus,
    "usePlus",
    ()=>usePlus,
    "writePlus",
    ()=>writePlus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/plus.ts [app-ssr] (ecmascript)");
"use client";
;
;
let cachedRaw = null;
let cachedState = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY_PLUS"];
function readPlus() {
    if ("TURBOPACK compile-time truthy", 1) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY_PLUS"];
    //TURBOPACK unreachable
    ;
}
function writePlus(value) {
    try {
        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLUS_KEY"], JSON.stringify(value));
    } catch  {
        throw new Error("Your browser couldn’t save this change. Free up storage or allow site storage and try again.");
    }
    window.dispatchEvent(new Event(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLUS_EVENT"]));
}
function updatePlus(change) {
    writePlus(change(readPlus()));
}
function subscribe(listener) {
    window.addEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLUS_EVENT"], listener);
    window.addEventListener("storage", listener);
    return ()=>{
        window.removeEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLUS_EVENT"], listener);
        window.removeEventListener("storage", listener);
    };
}
function usePlus() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, readPlus, ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$plus$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMPTY_PLUS"]);
}
}),
"[project]/src/lib/plus.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AVATARS",
    ()=>AVATARS,
    "EMPTY_PLUS",
    ()=>EMPTY_PLUS,
    "FREE_DARE_COUNT",
    ()=>FREE_DARE_COUNT,
    "PACKS",
    ()=>PACKS,
    "PLUS_DARE_COUNT",
    ()=>PLUS_DARE_COUNT,
    "PLUS_EVENT",
    ()=>PLUS_EVENT,
    "PLUS_GROUP_LIMIT",
    ()=>PLUS_GROUP_LIMIT,
    "PLUS_KEY",
    ()=>PLUS_KEY,
    "PLUS_PLANS",
    ()=>PLUS_PLANS,
    "PLUS_PROMO_CODE",
    ()=>PLUS_PROMO_CODE,
    "THEMES",
    ()=>THEMES,
    "activatePlus",
    ()=>activatePlus,
    "addCustomDare",
    ()=>addCustomDare,
    "addGroup",
    ()=>addGroup,
    "curatedSuggestions",
    ()=>curatedSuggestions,
    "currentWeekKey",
    ()=>currentWeekKey,
    "longestStreak",
    ()=>longestStreak,
    "redeemPlusPromo",
    ()=>redeemPlusPromo,
    "refreshWeeklyTokens",
    ()=>refreshWeeklyTokens,
    "requirePlus",
    ()=>requirePlus,
    "spendToken",
    ()=>spendToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
const PLUS_KEY = "daily-dare-plus-v1";
const PLUS_EVENT = "daily-dare-plus-updated";
const PLUS_GROUP_LIMIT = 50;
const FREE_DARE_COUNT = 465;
const PLUS_DARE_COUNT = 10000;
const PLUS_PROMO_CODE = "FRIENDS100";
const PLUS_PLANS = [
    "Monthly",
    "Yearly",
    "Founding"
];
const THEMES = [
    "teal",
    "violet",
    "sunset"
];
const AVATARS = [
    "🌱",
    "🌞",
    "🪩",
    "⚡",
    "🌊",
    "🦋"
];
;
const EMPTY_PLUS = {
    version: 1,
    enabled: false,
    activatedAt: null,
    plan: "Yearly",
    skips: 3,
    retries: 3,
    retryWeek: "",
    groups: [],
    dares: [],
    savedPacks: [],
    completed: {},
    profile: {
        name: "",
        bio: "",
        avatar: "",
        theme: "teal",
        icon: "teal"
    }
};
const BASE_PACKS = [
    {
        id: "fitness",
        title: "Find your rhythm",
        description: "Small moves. A little more energy.",
        emoji: "🌿",
        tint: "mint",
        dares: [
            {
                id: "fit-1",
                title: "A one-song stretch",
                instructions: "Put on a favourite song and gently stretch in a way that feels comfortable. Share a photo of your setup or a short clip.",
                category: "fitness",
                comfort: "gentle"
            },
            {
                id: "fit-2",
                title: "Take the scenic route",
                instructions: "Take a five-minute walk or roll somewhere accessible. Capture one detail you normally miss.",
                category: "fitness",
                comfort: "steady"
            },
            {
                id: "fit-3",
                title: "Make your own mini routine",
                instructions: "Combine three comfortable movements into a short routine. Move at your own pace and stop if anything hurts.",
                category: "fitness",
                comfort: "bold"
            }
        ]
    },
    {
        id: "creativity",
        title: "Make a little magic",
        description: "No talent required. Just curiosity.",
        emoji: "🎨",
        tint: "lavender",
        dares: [
            {
                id: "art-1",
                title: "Find your colour",
                instructions: "Find three everyday things in your favourite colour. Arrange them and take a photo.",
                category: "creativity",
                comfort: "gentle"
            },
            {
                id: "art-2",
                title: "The 60-second sketch",
                instructions: "Draw the nearest object without lifting your pen. Celebrate the wobbly lines.",
                category: "creativity",
                comfort: "steady"
            },
            {
                id: "art-3",
                title: "Tell a tiny story",
                instructions: "Make a three-frame photo story using objects you already own. Give it a surprising title.",
                category: "creativity",
                comfort: "bold"
            }
        ]
    },
    {
        id: "confidence",
        title: "A little braver",
        description: "Gentle steps outside your usual.",
        emoji: "✨",
        tint: "peach",
        dares: [
            {
                id: "con-1",
                title: "Give yourself some credit",
                instructions: "Write down one thing you handled well this week. Keep private details out of your photo.",
                category: "confidence",
                comfort: "gentle"
            },
            {
                id: "con-2",
                title: "Try a new combination",
                instructions: "Style an outfit using something you rarely wear. Take a photo just for yourself or your group.",
                category: "confidence",
                comfort: "steady"
            },
            {
                id: "con-3",
                title: "Your tiny victory speech",
                instructions: "Record a short celebration of something you learned. You choose who, if anyone, gets to see it.",
                category: "confidence",
                comfort: "bold"
            }
        ]
    },
    {
        id: "couples",
        title: "Better together",
        description: "A little more us-time.",
        emoji: "💌",
        tint: "rose",
        dares: [
            {
                id: "cou-1",
                title: "A note worth keeping",
                instructions: "Write your partner a kind note about an everyday thing you appreciate. Share only what you both want to share.",
                category: "couples",
                comfort: "gentle"
            },
            {
                id: "cou-2",
                title: "Trade favourite songs",
                instructions: "Each choose a favourite song, listen together, and explain what you love about it.",
                category: "couples",
                comfort: "steady"
            },
            {
                id: "cou-3",
                title: "Invent your next date",
                instructions: "Together, plan a free mini date using three things you already have. Both of you get a veto.",
                category: "couples",
                comfort: "bold"
            }
        ]
    },
    {
        id: "wellbeing",
        title: "Feel more grounded",
        description: "Small rituals for a steadier day.",
        emoji: "🌊",
        tint: "mint",
        dares: [
            {
                id: "well-1",
                title: "A quiet reset",
                instructions: "Take two minutes to notice what you need next.",
                category: "wellbeing",
                comfort: "gentle"
            }
        ]
    },
    {
        id: "outdoors",
        title: "Step outside",
        description: "Notice more of the world around you.",
        emoji: "🌤️",
        tint: "mint",
        dares: [
            {
                id: "out-1",
                title: "Look up",
                instructions: "Find one detail above eye level and remember it.",
                category: "outdoors",
                comfort: "gentle"
            }
        ]
    },
    {
        id: "food",
        title: "Make it delicious",
        description: "Turn everyday food into a tiny celebration.",
        emoji: "🍋",
        tint: "peach",
        dares: [
            {
                id: "food-1",
                title: "A mindful bite",
                instructions: "Slow down for one bite and notice its texture and flavour.",
                category: "food",
                comfort: "gentle"
            }
        ]
    },
    {
        id: "learning",
        title: "Stay curious",
        description: "Follow one small question wherever it leads.",
        emoji: "📚",
        tint: "lavender",
        dares: [
            {
                id: "learn-1",
                title: "Ask why",
                instructions: "Write down one question and spend five minutes exploring it.",
                category: "learning",
                comfort: "gentle"
            }
        ]
    },
    {
        id: "connection",
        title: "Reach out",
        description: "Make room for meaningful little connections.",
        emoji: "💬",
        tint: "rose",
        dares: [
            {
                id: "connect-1",
                title: "Send warmth",
                instructions: "Send a thoughtful message with no request attached.",
                category: "connection",
                comfort: "gentle"
            }
        ]
    },
    {
        id: "home",
        title: "Make space",
        description: "Create a little more ease where you live.",
        emoji: "🪴",
        tint: "peach",
        dares: [
            {
                id: "home-1",
                title: "One small corner",
                instructions: "Make one small corner more welcoming for tomorrow.",
                category: "home",
                comfort: "gentle"
            }
        ]
    }
];
const dareExpansion = {
    fitness: {
        subjects: [
            "your morning",
            "a favourite song",
            "your front door",
            "a quiet corner",
            "your lunch break",
            "the nearest park",
            "your evening wind-down",
            "a familiar route",
            "your desk",
            "the next five minutes"
        ],
        actions: [
            "stretch gently",
            "take a mindful walk",
            "try three comfortable movements",
            "notice your breathing",
            "change your pace",
            "reach and reset",
            "dance for one song",
            "pause for a body scan",
            "explore a new route",
            "finish with a calm reset"
        ],
        details: [
            "Stop whenever your body asks you to.",
            "Keep it comfortable and choose your own pace.",
            "No performance is needed; simply notice how it feels.",
            "Adapt the movement to suit your space and ability.",
            "Capture one detail from the moment if you want to remember it."
        ]
    },
    creativity: {
        subjects: [
            "three colours",
            "the nearest object",
            "a window view",
            "your favourite phrase",
            "a pocket-sized story",
            "an everyday texture",
            "a familiar song",
            "a tiny collection",
            "your breakfast",
            "an ordinary corner"
        ],
        actions: [
            "make a quick sketch",
            "write six lines",
            "take three photos",
            "build a small arrangement",
            "invent a new title",
            "make a tiny collage",
            "describe it in a surprising way",
            "turn it into a pattern",
            "record a one-minute idea",
            "reframe it as a story"
        ],
        details: [
            "Let it be playful rather than polished.",
            "Use only what you already have nearby.",
            "Give yourself one minute and follow your curiosity.",
            "There is no wrong version of this experiment.",
            "Keep the result private or share it with your circle."
        ]
    },
    confidence: {
        subjects: [
            "something you handled well",
            "a small preference",
            "a recent lesson",
            "your everyday outfit",
            "a kind thought",
            "a useful boundary",
            "a question you have",
            "a quiet win",
            "your next step",
            "a quality you value"
        ],
        actions: [
            "write yourself a note",
            "say it out loud",
            "choose with intention",
            "ask for what you need",
            "celebrate the effort",
            "try a small new choice",
            "name what matters",
            "share a gentle truth",
            "practice receiving a compliment",
            "take one brave step"
        ],
        details: [
            "Keep the step small enough to feel possible.",
            "You decide whether anyone else sees it.",
            "There is no need to perform confidence.",
            "A quiet attempt still counts as showing up.",
            "Stop or change course if it does not feel right."
        ]
    },
    couples: {
        subjects: [
            "a shared memory",
            "your next free evening",
            "a favourite meal",
            "an everyday habit",
            "a song you both know",
            "a place nearby",
            "something you appreciate",
            "a silly question",
            "a future idea",
            "a quiet moment"
        ],
        actions: [
            "write a kind note",
            "take turns answering",
            "make a small plan",
            "share a favourite",
            "try a new ritual",
            "give a sincere compliment",
            "recreate a memory",
            "invent a tiny tradition",
            "listen without fixing",
            "celebrate the ordinary"
        ],
        details: [
            "Both people get a comfortable way to participate.",
            "Keep it low-pressure and make room for a veto.",
            "The point is connection, not a perfect result.",
            "Share only what you both want to keep private.",
            "Let the moment be simple and unhurried."
        ]
    },
    wellbeing: {
        subjects: [
            "your energy",
            "a quiet pause",
            "your senses",
            "your sleep routine",
            "a comfortable place",
            "your attention",
            "a kind boundary",
            "your breathing",
            "a small comfort",
            "the next hour"
        ],
        actions: [
            "take a gentle pause",
            "write a check-in",
            "make a calming ritual",
            "put one thing down",
            "choose a softer option",
            "notice five details",
            "make room for rest",
            "clear one small worry",
            "name what is enough",
            "end with gratitude"
        ],
        details: [
            "There is no need to optimize the moment.",
            "Choose what feels supportive today.",
            "Keep it brief and pressure-free.",
            "You can adapt this to your own needs.",
            "Let enough be enough."
        ]
    },
    outdoors: {
        subjects: [
            "the sky",
            "a nearby path",
            "a tree",
            "your street",
            "a patch of sunlight",
            "a sound outside",
            "a changing shadow",
            "a local landmark",
            "a cloud",
            "the weather"
        ],
        actions: [
            "notice one detail",
            "take a slow stroll",
            "find a new viewpoint",
            "photograph a pattern",
            "listen without headphones",
            "follow a colour",
            "pause at a doorway",
            "look for signs of change",
            "trace a familiar route",
            "bring one detail home"
        ],
        details: [
            "Stay within a route that feels comfortable.",
            "You do not need to go far.",
            "Notice without needing to name everything.",
            "Bring a friend or choose a familiar place if helpful.",
            "The smallest outing counts."
        ]
    },
    food: {
        subjects: [
            "a snack",
            "your morning drink",
            "a leftover",
            "one ingredient",
            "a family recipe",
            "a market aisle",
            "your next meal",
            "a crunchy bite",
            "a warm bowl",
            "a simple dessert"
        ],
        actions: [
            "slow down and taste",
            "arrange it beautifully",
            "try a new combination",
            "write a flavour note",
            "make a tiny ritual",
            "share a recipe",
            "notice the texture",
            "add one bright detail",
            "serve it with care",
            "celebrate the first bite"
        ],
        details: [
            "Use what you already have.",
            "Keep it accessible and easy.",
            "There is no need to make it perfect.",
            "Notice pleasure without rushing it.",
            "Share only what feels comfortable."
        ]
    },
    learning: {
        subjects: [
            "a word",
            "a local fact",
            "a how-to question",
            "a historical detail",
            "a new skill",
            "a familiar idea",
            "a useful shortcut",
            "a book page",
            "a curious sound",
            "a small mystery"
        ],
        actions: [
            "look it up",
            "teach it back",
            "make three notes",
            "draw a simple map",
            "ask a better question",
            "try a five-minute lesson",
            "compare two ideas",
            "explain it simply",
            "find a practical use",
            "save one useful fact"
        ],
        details: [
            "Follow curiosity rather than perfection.",
            "Five minutes is enough to begin.",
            "Keep your notes in a place you can revisit.",
            "You can stop when the question feels answered.",
            "Share the discovery if you feel like it."
        ]
    },
    connection: {
        subjects: [
            "a friend",
            "a neighbour",
            "a family member",
            "a colleague",
            "someone you miss",
            "a shared memory",
            "a quiet thank-you",
            "a group chat",
            "a helpful person",
            "your future self"
        ],
        actions: [
            "send a warm message",
            "ask a real question",
            "offer appreciation",
            "share a small joy",
            "make a low-pressure plan",
            "listen closely",
            "leave a kind note",
            "check in gently",
            "celebrate their effort",
            "say thank you"
        ],
        details: [
            "Do not expect a reply right away.",
            "Keep the invitation easy to decline.",
            "A small message can be enough.",
            "Respect privacy and personal boundaries.",
            "Connection works best without pressure."
        ]
    },
    home: {
        subjects: [
            "a drawer",
            "your entryway",
            "a bedside surface",
            "a shelf",
            "your workspace",
            "a plant",
            "a cosy corner",
            "your laundry routine",
            "a shared space",
            "tomorrow morning"
        ],
        actions: [
            "reset one surface",
            "make it easier to use",
            "remove three things",
            "add a welcoming detail",
            "prepare for tomorrow",
            "repair one tiny annoyance",
            "let more light in",
            "create a drop zone",
            "make a comfort station",
            "finish a five-minute task"
        ],
        details: [
            "Stop after the small win.",
            "Use what you already have.",
            "Aim for ease rather than perfection.",
            "Choose the smallest useful version.",
            "Notice how the space feels afterward."
        ]
    }
};
function expandDares(pack) {
    const templates = dareExpansion[pack.id];
    const expanded = [
        ...pack.dares
    ];
    for(let index = expanded.length; index < 1000; index++){
        const subject = templates.subjects[index % templates.subjects.length];
        const action = templates.actions[Math.floor(index / templates.subjects.length) % templates.actions.length];
        const detail = templates.details[Math.floor(index / (templates.subjects.length * templates.actions.length)) % templates.details.length];
        expanded.push({
            id: `${pack.id}-${index + 1}`,
            title: `${action.charAt(0).toUpperCase()}${action.slice(1)}: ${subject}`,
            instructions: `${action} with ${subject}. ${detail}`,
            category: pack.id,
            comfort: [
                "gentle",
                "steady",
                "bold"
            ][index % 3]
        });
    }
    return expanded;
}
const PACKS = BASE_PACKS.map((pack)=>({
        ...pack,
        dares: expandDares(pack)
    }));
function curatedSuggestions(interests, comfort, offset = 0) {
    const levels = [
        "gentle",
        "steady",
        "bold"
    ];
    const eligible = PACKS.filter((p)=>interests.includes(p.id)).flatMap((p)=>p.dares).filter((d)=>levels.indexOf(d.comfort) <= levels.indexOf(comfort));
    if (!eligible.length) return [];
    const start = (offset % eligible.length + eligible.length) % eligible.length;
    return [
        ...eligible.slice(start),
        ...eligible.slice(0, start)
    ].slice(0, 3);
}
function activatePlus(state) {
    return {
        ...state,
        enabled: true,
        activatedAt: state.activatedAt ?? new Date().toISOString()
    };
}
function redeemPlusPromo(state, code) {
    if (code.trim().toUpperCase() !== PLUS_PROMO_CODE) throw new Error("That promo code is not valid.");
    return activatePlus(state);
}
function currentWeekKey(date = new Date()) {
    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}
function refreshWeeklyTokens(state) {
    const week = currentWeekKey();
    return state.retryWeek === week ? state : {
        ...state,
        skips: 3,
        retries: 3,
        retryWeek: week
    };
}
function requirePlus(state) {
    if (!state.enabled) throw new Error("Start your free Plus preview to use this feature.");
}
function spendToken(state, kind) {
    requirePlus(state);
    const current = refreshWeeklyTokens(state);
    if (current[kind] < 1) throw new Error(`No ${kind === "skips" ? "skip" : "try again"} tokens left${kind === "retries" ? " this week" : " in this preview"}.`);
    return {
        ...current,
        [kind]: current[kind] - 1
    };
}
function addGroup(state, name, members) {
    requirePlus(state);
    const cleanName = name.trim();
    const cleanMembers = [
        ...new Set(members.map((m)=>m.trim()).filter(Boolean))
    ];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateUserText"])(`${cleanName} ${cleanMembers.join(" ")}`)) throw new Error("Please remove inappropriate language before saving this circle.");
    if (!cleanName || cleanName.length > 50) throw new Error("Give your group a name of 1–50 characters.");
    if (cleanMembers.length + 1 > PLUS_GROUP_LIMIT) throw new Error(`Plus groups support ${PLUS_GROUP_LIMIT} people, including you.`);
    if (cleanMembers.some((m)=>m.length > 60)) throw new Error("Keep each member name under 60 characters.");
    return {
        ...state,
        groups: [
            ...state.groups,
            {
                id: crypto.randomUUID(),
                name: cleanName,
                members: cleanMembers
            }
        ]
    };
}
function addCustomDare(state, dare) {
    requirePlus(state);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateUserText"])(`${dare.title} ${dare.instructions} ${dare.audience}`)) throw new Error("Please remove inappropriate language before saving this dare.");
    if (!dare.title.trim() || dare.title.length > 80 || !dare.instructions.trim() || dare.instructions.length > 500) throw new Error("Add a title (up to 80 characters) and instructions (up to 500).");
    if (!dare.audience.trim() || dare.audience.length > 100) throw new Error("Choose who this dare is for.");
    return {
        ...state,
        dares: [
            {
                ...dare,
                title: dare.title.trim(),
                instructions: dare.instructions.trim(),
                id: crypto.randomUUID()
            },
            ...state.dares
        ]
    };
}
function longestStreak(dates) {
    const sorted = [
        ...new Set(dates)
    ].sort();
    let best = 0, run = 0, previous = NaN;
    for (const date of sorted){
        const stamp = Date.parse(`${date}T12:00:00Z`);
        run = stamp - previous === 86400000 ? run + 1 : 1;
        best = Math.max(best, run);
        previous = stamp;
    }
    return best;
}
}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(url && anonKey);
const supabase = isSupabaseConfigured ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(url, anonKey) : null;
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_CAPTION_LENGTH",
    ()=>MAX_CAPTION_LENGTH,
    "MAX_PHOTO_SIZE",
    ()=>MAX_PHOTO_SIZE,
    "MAX_VIDEO_SIZE",
    ()=>MAX_VIDEO_SIZE,
    "MEDIA_EXTENSIONS",
    ()=>MEDIA_EXTENSIONS,
    "PHOTO_ACCEPT",
    ()=>PHOTO_ACCEPT,
    "VIDEO_ACCEPT",
    ()=>VIDEO_ACCEPT,
    "formatCount",
    ()=>formatCount,
    "parseCaption",
    ()=>parseCaption,
    "validateMediaFile",
    ()=>validateMediaFile,
    "validateUserText",
    ()=>validateUserText,
    "validateVideoFile",
    ()=>validateVideoFile
]);
const MAX_VIDEO_SIZE = 80 * 1024 * 1024;
const MAX_PHOTO_SIZE = 20 * 1024 * 1024;
const MEDIA_EXTENSIONS = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov"
};
const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";
const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";
function validateMediaFile(file) {
    if (!Object.hasOwn(MEDIA_EXTENSIONS, file.type)) return "Choose a JPG, PNG, or WebP photo, or an MP4, WebM, or MOV video.";
    if (file.size === 0) return "This file is empty. Choose another photo or video.";
    if (file.type.startsWith("image/") && file.size > MAX_PHOTO_SIZE) return "Photos must be 20 MB or smaller.";
    if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE) return "Videos must be 80 MB or smaller.";
    return null;
}
const MAX_CAPTION_LENGTH = 180;
const INAPPROPRIATE_CONTENT_PATTERNS = [
    /\bnsfw\b/i,
    /\bporn(?:ography)?\b/i,
    /\bonlyfans\b/i,
    /\bgoatse\b/i
];
function validateUserText(value) {
    if (INAPPROPRIATE_CONTENT_PATTERNS.some((pattern)=>pattern.test(value))) return "Please remove inappropriate language before continuing.";
    return null;
}
function parseCaption(caption) {
    return caption.split(/(#[\w-]+|@[\w.-]+)/g).filter(Boolean).map((part, index)=>{
        if (part.startsWith("#")) return {
            text: part,
            kind: "hashtag",
            key: `${part}-${index}`
        };
        if (part.startsWith("@")) return {
            text: part,
            kind: "mention",
            key: `${part}-${index}`
        };
        return {
            text: part,
            kind: "text",
            key: `${part}-${index}`
        };
    });
}
function validateVideoFile(file) {
    const validType = [
        "video/mp4",
        "video/webm",
        "video/quicktime"
    ].includes(file.type);
    if (!validType) return "Choose an MP4, WebM, or MOV video.";
    if (file.size > MAX_VIDEO_SIZE) return "Videos must be 80 MB or smaller.";
    return null;
}
function formatCount(value) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(value);
}
}),
];

//# sourceMappingURL=src_18-4r9l._.js.map