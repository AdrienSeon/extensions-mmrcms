import { LanguageCode, SourceInfo, TagType } from "paperback-extensions-common";
import { Mmrcms } from "../Mmrcms";

const PHOENIXSCANS_DOMAIN = "https://phoenix-scans.pl";

export const PhoenixScansInfo: SourceInfo = {
	version: "1.0.0",
	name: "Phoenix-Scans",
	description: "Extension that pulls manga from phoenix-scans.pl",
	author: "Ankah",
	authorWebsite: "https://github.com/adrienseon",
	icon: "icon.png",
	hentaiSource: false,
	websiteBaseURL: PHOENIXSCANS_DOMAIN,
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

export class PhoenixScans extends Mmrcms {
	baseUrl: string = PHOENIXSCANS_DOMAIN;
	languageCode: LanguageCode = LanguageCode.POLISH;
	sourceTraversalPathName: string = "manga";
}