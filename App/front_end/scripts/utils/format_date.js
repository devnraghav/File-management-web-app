export default function format_date(date_milliseconds) {
    const date = new Date(date_milliseconds);
    return date.toString().split(' ').slice(0, 4).join(' ');
}