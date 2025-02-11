import { format } from 'date-fns';

export const convertIsoDateToUnixAndFormat = (isoDate: string) => {
    const unixTimestamp = Math.floor(new Date(isoDate).getTime() / 1000);

    const formattedDate = format(new Date(isoDate), "do MMM, yyyy");

    return `${unixTimestamp} (${formattedDate})`;
};
