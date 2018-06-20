// ==UserScript==
// @name         Super Chat Calc
// @namespace    http://mizle.net/
// @version      0.5
// @description  Show Youtube Live Super Chat total amounts.
// @author       eai04191
// @match        https://*.youtube.com/live_chat?*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @!require      https://cdn.rawgit.com/naugtur/insertionQuery/master/insQ.min.js
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    var total = 0;
    const appTitle = "Super Chat Calc";
    const baseUnit = ["¥", "￥"];

    var exchange = false;
    const jpyRate = 1;
    const usdRate = 108.69;
    const gbpRate = 154.00;
    const eurRate = 135.07;
    const ntdRate = 3.76;
    const hkdRate = 13.90;
    const krwRate = 0.10;
    const cadRate = 88.29;
    const chdRate = 116.56;

    console.log(`[${appTitle}] Starting`);

    function calcSuperChat(amountStr) {
        // ,を消す、単位と数を分ける
        amountStr = amountStr.split(",").join("").match(/\d+(?:\.\d+)?/);

        var unit = amountStr.input.split(amountStr).join("");

        var amount = parseInt(amountStr);
        if (unit == "$") {
            amount = amount * usdRate;
            exchange = true;
        } else if (unit == "£") {
            amount = amount * gbpRate;
            exchange = true;
        } else if (unit == "€") {
            amount = amount * eurRate;
            exchange = true;
        } else if (unit == "NT$") {
            amount = amount * ntdRate;
            exchange = true;
        } else if (unit == "HK$") {
            amount = amount * hkdRate;
            exchange = true;
        } else if (unit == "₩") {
            amount = amount * krwRate;
            exchange = true;
        } else if (unit == "CA$") {
            amount = amount * cadRate;
            exchange = true;
        } else if (unit == "CHF") {
            amount = amount * chfRate;
            exchange = true;
        } else if (baseUnit.indexOf(unit) == -1) {
            console.log(`[${appTitle}] Unknown unit: ${unit}`);
            return false;
        }

        total = total + amount;
        var formattedTotal = String(total.toFixed(1)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        var html = `
            <div id="supercatcalc">
                <p style="margin:0;">
                    Super Chat合計額:
                    ${(exchange ? "約" : "")}
                    <span id="supercatcalc-unit">${baseUnit[0]}</span>
                    <span id="supercatcalc-amount">${formattedTotal}</span>
                </p>
            </div>`;
        $("#supercatcalc").remove();
        $("#picker-buttons").append(html);
    }

    // 読み込み時ティッカーにある物を拾う
    $("yt-live-chat-ticker-paid-message-item-renderer").each(function () {
        var str = $(this).attr("aria-label");
        console.log(`[${appTitle}] Add ticker Super Chat: ${str}`);
        if (str != "Sponsor") {
            calcSuperChat(str);
        }
    });


    // 追加されたSuper Chatを拾う
    insertionQ.config({
        timeout: 5
    });
    insertionQ("yt-live-chat-paid-message-renderer").every(function (element) {
        var name = $(element).find("#author-name").text();
        var amount = $(element).find("#purchase-amount").text();
        console.log(`[${appTitle}] Add Super Chat: ${amount} by ${name}`);
        if (amount != "Sponsor") {
            calcSuperChat(amount);
        }
    });
})();