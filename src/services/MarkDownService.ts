import { Service } from "typedi";
import marked from "marked";

@Service()
export default class MarkDownService {
  public parse(markdownText: string): string {
    markdownText = markdownText.replaceAll("<", "&lt;");
    markdownText = markdownText.replaceAll(">", "&gt;");
    return marked(markdownText);
  }
}
