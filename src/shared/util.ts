import { Todo } from "./todo.interface";

export const padUrlWithHttp = (url: string) => {
    if (url.startsWith("http")) return url;
    return `http://${url}`;
};

export const prettifyPoms = (poms: string) => {
    return poms === "0.5" || poms === "1/2" ? "½" : poms;
};

const convertStringPoms = (poms: string) => {
    if (poms === '1/2') return 0.5;
    return parseFloat(poms);
}

export const sortTodos = (a: Todo, b: Todo) => {
    if (a.done === b.done) {
        return convertStringPoms(a.poms) - convertStringPoms(b.poms);
    } else {
        return Number(a.done) - Number(b.done);
    }
};
