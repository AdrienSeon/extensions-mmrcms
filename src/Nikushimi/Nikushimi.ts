import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const NIKUSHIMI_DOMAIN = "https://azbivo.webd.pro";

export const NikushimiInfo: SourceInfo = {
	version: "1.0.0",
	name: "Nikushimi",
	description: "Extension that pulls manga from azbivo.webd.pro",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: NIKUSHIMI_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Polish",
			type: TagType.GREY,
		},
	],
};

export class Nikushimi extends Mmrcms {
	baseUrl: string = NIKUSHIMI_DOMAIN;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceTraversalPathName: string = "manga";
}