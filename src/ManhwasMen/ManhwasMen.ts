import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const MANHWASMAN_DOMAIN = "https://manhwas.men/";

export const ManhwasMenInfo: SourceInfo = {
	version: "1.0.0",
	name: "Manhwas.men",
	description: "Extension that pulls manga from manhwas.men",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: MANHWASMAN_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
	],
};

export class ManhwasMen extends Mmrcms {
	baseUrl: string = MANHWASMAN_DOMAIN;
	languageCode: LanguageCode = LanguageCode.ENGLISH;
	sourceTraversalPathName: string = "manga";
}