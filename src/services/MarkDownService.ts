import { Service } from "typedi";
import marked from "marked";
import StringUtil from "@/utils/StringUtil";

@Service()
export default class MarkDownService {
  public parse(markdownText: string): string {
    markdownText = StringUtil.replaceAll(markdownText, "<", "&lt;");
    markdownText = StringUtil.replaceAll(markdownText, ">", "&gt;");
    return marked(markdownText);
  }
}
