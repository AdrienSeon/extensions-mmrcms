import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, DateFormat } from "..";

export const MangazukiRawsInfo: SourceInfo = {
    version: "1.0.0",
    name: "Mangazuki Raws",
    description: "Extension that pulls manga from raws.mangazuki.co",
    author: "Ankah",
    authorWebsite: "https://github.com/adrienseon",
    icon: "icon.png",
    hentaiSource: false,
    websiteBaseURL: "https://raws.mangazuki.co",
    sourceTags: [
        {
            text: "Notifications",
            type: TagType.GREEN,
        },
        {
            text: "Korean",
            type: TagType.GREY,
        },
        {
            text: "Cloudflare",
            type: TagType.RED,
        },
    ],
};

export class MangazukiRaws extends Mmrcms {
    name: string = MangazukiRawsInfo.name;
    baseUrl: string = MangazukiRawsInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.KOREAN;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "T",
        yesterdayTranslation: "Y",
    };
}
