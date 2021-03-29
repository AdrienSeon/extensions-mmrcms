import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms, DateFormat } from "../..";

export const OnmaInfo: SourceInfo = {
	version: "1.0.0",
	name: "مانجا اون لاين",
	description: "Extension that pulls manga from onma.me",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: "https://onma.me",
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Arabic",
			type: TagType.GREY,
		},
	],
};

export class Onma extends Mmrcms {
    name: string = OnmaInfo.name;
    baseUrl: string = OnmaInfo.websiteBaseURL;
    languageCode: LanguageCode = LanguageCode.UNKNOWN; // ! ARABIC enum not implemented
    dateFormat: DateFormat = {
        format: "DD/MM/YYYY",
        todayTranslation: "اليوم",
        yesterdayTranslation: "في الامس",
    };
}
