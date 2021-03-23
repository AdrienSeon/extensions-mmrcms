import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const FALLENANGELSSCANS_DOMAIN = "https://truyen.fascans.com";

export const FallenAngelsScansInfo: SourceInfo = {
	version: "1.0.0",
	name: "FallenAngelsScans",
	description: "Extension that pulls manga from truyen.fascans.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: FALLENANGELSSCANS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Vietnamese",
			type: TagType.GREY,
		},
	],
};

export class FallenAngelsScans extends Mmrcms {
	baseUrl: string = FALLENANGELSSCANS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.VIETNAMESE;
	sourceTraversalPathName: string = "manga";
}