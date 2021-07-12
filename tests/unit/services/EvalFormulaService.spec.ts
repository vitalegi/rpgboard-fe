import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import { Container } from "typedi";
import EvalFormulaService from "@/services/EvalFormulaService";

let placeholders = new Map<string, number>();
let service: EvalFormulaService;

describe("EvalFormulaService.ts", () => {
  beforeEach(() => {
    placeholders = new Map<string, number>();
    placeholders.set("A", 5);
    placeholders.set("B", 0);
    placeholders.set("C", -3);

    service = Container.get<EvalFormulaService>(EvalFormulaService);
  });
  it("Numbers are parsed", () => {
    expect(service.evaluateWithoutRolls("10", placeholders)).to.equal(10);
  });
  it("Numbers with whitespaces are parsed", () => {
    expect(service.evaluateWithoutRolls(" 10+\t20 ", placeholders)).to.equal(
      30
    );
  });
  it("Placeholder is parsed", () => {
    expect(service.evaluateWithoutRolls("A", placeholders)).to.equal(5);
  });
  it("Invalid placeholder trigger exception", () => {
    expect(() => service.evaluateWithoutRolls("Z", placeholders)).to.throw(
      "Formula Z is not parsable"
    );
  });
  it("Dice roll is parsed properly with 1 dice", () => {
    expect(service.printableFormula("1d10", placeholders)).to.equal("d10");
  });
  it("Dice rolls is parsed properly with multiple dice", () => {
    expect(service.printableFormula("2d10", placeholders)).to.equal("2d10");
  });
  it("Dice rolls is parsed properly with whitespaces", () => {
    expect(service.printableFormula("  2d10\t  ", placeholders)).to.equal(
      "2d10"
    );
  });
  it("Formula is evaluated properly", () => {
    expect(
      service.printableFormula("1d10 + A + B + C + 10", placeholders)
    ).to.equal("d10+12");
  });
});
