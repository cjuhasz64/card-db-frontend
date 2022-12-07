export default function getForeignName(colTitle) {
    return colTitle.includes('id') ? colTitle.split("_")[0] : colTitle
}