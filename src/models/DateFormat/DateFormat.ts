export interface DateFormat {
    /**
     * The date format for this source Eg. DD/MM/YYY or MM/DD/YYY etc.
     * Can also be "timeAgo" for relative time sources Eg. mangaID
     */
    format: string;

    /**
     * The translation for "today" for this source Eg. "aujourd'hui"
     */
    todayTranslation: string;

    /**
     * The translation for "yesterday" for this source Eg. "hier"
     */
    yesterdayTranslation: string;
}
