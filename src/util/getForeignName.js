const pluralize = require('pluralize')

export default function getForeignName(colTitle, isLink = false) {

    if (colTitle.includes('_id')) {
        return pluralize(colTitle.split('_')[0]);
    } else if (colTitle.includes('_list')) {
        if (isLink) {
            return `${colTitle.split('_')[0]}_link`;
        }
        return `${colTitle.split('_')[0]}`;
    } else {
        return colTitle
    }
} 