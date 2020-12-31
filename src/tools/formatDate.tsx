import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

export function formatDate(date: string) {
    return format(parseISO(date), "dd.MM.yyyy");
}