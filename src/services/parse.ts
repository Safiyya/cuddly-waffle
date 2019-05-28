class HTMLParser {

    parse(html: HTMLElement): string[] {
        if (html.childNodes)
            this.traverse(html);

        return [];
    }

    private traverse(element: HTMLElement) {
        element.childNodes.forEach((child: ChildNode) => {
            // console.log(child.nodeType);
        });
    }

}

export const htmlParser = new HTMLParser();
