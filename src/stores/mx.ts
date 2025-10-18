
// ===============================
// MX Store (Pinia)
// ===============================
// This file contains the main store for the application, which is responsible for managing the global state of the application.
// It is used to store the current user's information and the base64 encoded image of the PMC Elevate and etc.
// ===============================


import { defineStore } from "pinia";
import { useMediaQuery } from "@vueuse/core"
import { v4 as uuidv4 } from 'uuid'

export const useMXStore = defineStore("mx", {
    state: () => ({
        mx: 0,
        baseApi_Url: import.meta.env.VITE_BASE_API,
        lang: [
            { text: "English", value: "en" },
            { text: "Filipino / Tagalog", value: "fil" },
            { text: "Mandarin Chinese", value: "zh" },
            { text: "Cantonese Chinese", value: "yue" },
            { text: "Spanish", value: "es" },
            { text: "Japanese", value: "ja" },
            { text: "Korean", value: "ko" },
            { text: "French", value: "fr" },
            { text: "German", value: "de" },
            { text: "Italian", value: "it" },
            { text: "Portuguese", value: "pt" },
            { text: "Russian", value: "ru" },
            { text: "Arabic", value: "ar" },
            { text: "Hindi", value: "hi" },
            { text: "Bengali", value: "bn" },
            { text: "Urdu", value: "ur" },
            { text: "Thai", value: "th" },
            { text: "Vietnamese", value: "vi" },
            { text: "Malay / Bahasa", value: "ms" },
            { text: "Indonesian", value: "id" },
            { text: "Turkish", value: "tr" },
            { text: "Greek", value: "el" },
            { text: "Polish", value: "pl" },
            { text: "Dutch", value: "nl" },
            { text: "Hebrew", value: "he" },
            { text: "Swedish", value: "sv" },
            { text: "Norwegian", value: "no" },
            { text: "Danish", value: "da" },
            { text: "Finnish", value: "fi" },
            { text: "Czech", value: "cs" },
            { text: "Hungarian", value: "hu" },
            { text: "Romanian", value: "ro" },
            { text: "Swahili", value: "sw" },
            { text: "Zulu", value: "zu" },
        ],
        originUrl: window.location.origin + '/app',
        isMobile: useMediaQuery("(max-width: 768px)"),
        isTablet: useMediaQuery("(max-width: 1024px)"),
        isDesktop: useMediaQuery("(max-width: 1280px)"),
        iswide: useMediaQuery("(min-width: 1280px)"),

    }),
    getters: {
        getMX: (state) => state.mx,
    },
    actions: {
        setMX(mx: number) {
            this.mx = mx;
        },
        getUrl(url: string) {
            return this.baseApi_Url + url;
        },

        getFile(data: any){
            let base64 = btoa(JSON.stringify(data))
            let filename = '/view/file/' + base64
            let baseApi_Url = this.getUrl(filename)
            return baseApi_Url
        },
        getImg(data: any){
            let filename = '/images/' + data.filename
            let baseApi_Url = this.getUrl(filename)
            return baseApi_Url
        },
        getDoc(data: any){
            let filename = '/doc/' + data.filename
            let baseApi_Url = this.getUrl(filename)
            return baseApi_Url
        },

        formatDate(date: string){
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            };
            let newDate = new Date(date)
            return newDate.toLocaleDateString('en-US', options).replace(/\/+/g, '/');
        },
        getDeviceId(): string {
            let deviceId = localStorage.getItem("device_id");
            if (!deviceId) {
                deviceId = uuidv4();
                localStorage.setItem("device_id", deviceId);
            }
            return deviceId;
        },
        getUserAgent(): string {
            return navigator.userAgent;
        }
    },
    
});