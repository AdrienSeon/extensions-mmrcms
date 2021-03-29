import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, DateFormat } from "../..";

export const OpVfInfo: SourceInfo = {
	version: "1.0.0",
	name: "Op-VF",
	description: "Extension that pulls manga from op-vf.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://op-vf.com",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "French",
			type: TagType.GREY,
        },
		{
			text: "Cloudflare",
			type: TagType.RED,
		},
	],
};

export class OpVf extends Mmrcms {
    name: string = OpVfInfo.name;
    baseUrl: string = OpVfInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.FRENCH;
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "aujourd'hui",
        yesterdayTranslation: "hier",
    };
}
