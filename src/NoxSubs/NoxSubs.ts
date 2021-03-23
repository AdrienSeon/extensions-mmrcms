import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const NOXSUBS_DOMAIN = "https://noxsubs.com";

export const NoxSubsInfo: SourceInfo = {
	version: "1.0.0",
	name: "NoxSubs",
	description: "Extension that pulls manga from noxsubs.com",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: NOXSUBS_DOMAIN,
	sourceTags: [
		{
			text: "Notifications",
			type: TagType.GREEN,
		},
		{
			text: "Turkish",
			type: TagType.GREY,
		},
	],
};

export class NoxSubs extends Mmrcms {
	baseUrl: string = NOXSUBS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.TURKISH;
	sourceTraversalPathName: string = "manga";
}