import React from 'react';
import { AGLCPart, AGLCChapter, AGLCUnit, AGLCRule } from '../titles';
import Scrollspy from 'react-scrollspy';

class RuleIndex extends React.Component<{rules: AGLCRule[], active: boolean}> {
  render() {
    const { rules, active } = this.props;
    let slugs: string[] = [];
    let rls = rules.map(rule => {
      slugs.push(rule.slug + "-block");
      return <li className="nav-rule" key={rule.slug}>
        <a href={'#'+rule.slug}>{rule.ruleId + " " + rule.ruleTitle}</a>
      </li>
    })
    return (
      <Scrollspy className="scrollspy" offset={-100} items={slugs} currentClassName={ active && 'scrollspy-current' || '' }>
        {rls}
      </Scrollspy>
    )
  }
}

class UnitIndex extends React.Component<{units: AGLCUnit[], active: boolean}, {selfActive: string}> {
  constructor(props: any) {
    super(props);
    this.state = { selfActive: "_______" };
    this.setActive = this.setActive.bind(this);
  }
  setActive(el: Element) {
    if (el) {
      this.setState({ selfActive: el.id });
    }
  }
  render() {
    const { units, active } = this.props;
    const { selfActive } = this.state;
    let slugs: string[] = [];
    let us = units.map(unit => {
        slugs.push(unit.slug + "-block");
        return <li className="nav-unit" key={unit.slug}>
        <a href={'#'+unit.slug}>{unit.parsed.ruleId + " " + unit.parsed.rest}</a>
        <RuleIndex rules={unit.rules} active={active && selfActive === (unit.slug + "-block")} />
        </li>
        })
    return (
      <Scrollspy className="scrollspy" offset={-100} items={slugs}
        currentClassName={ active && 'scrollspy-current' || '' }
        onUpdate={this.setActive}>
      {us}
      </Scrollspy>
    )
  }
}

class ChapterIndex extends React.Component<{chapters: AGLCChapter[], active: boolean}, {selfActive: string}> {
  constructor(props: any) {
    super(props);
    this.state = { selfActive: "_______" };
    this.setActive = this.setActive.bind(this);
  }
  setActive(el: Element) {
    if (el) {
      this.setState({ selfActive: el.id });
    }
  }
  render() {
    const { selfActive } = this.state;
    const { chapters, active } = this.props;
    let slugs: string[] = [];
    let chs = chapters.map(chapter => {
      slugs.push(chapter.slug + "-block");
      return <li className="nav-chapter" key={chapter.slug}>
        <a href={'#'+chapter.slug}>{chapter.chapterNumber + " " + chapter.chapterTitle}</a>
        <UnitIndex units={chapter.units} active={active && selfActive === (chapter.slug + "-block")} />
      </li>
    });
    return (
      <Scrollspy className="scrollspy" offset={-100} items={slugs}
        currentClassName={ active && 'scrollspy-current' || '' }
        onUpdate={this.setActive}>
        {chs}
      </Scrollspy>
    )
  }
}

export class PartIndex extends React.Component<{parts: AGLCPart[]}, {selfActive: string}> {
  constructor(props: any) {
    super(props);
    this.state = { selfActive: "______________" };
    this.setActive = this.setActive.bind(this);
  }
  setActive(el: Element) {
    if (el) {
      this.setState({ selfActive: el.id });
    }
  }
  render() {
    const { parts } = this.props;
    const { selfActive } = this.state;
    let slugs: string[] = [];
    let _parts = parts.map(part => {
      slugs.push(part.slug + "-block");
      return <li className="nav-part" key={part.slug}>
        <a href={'#'+part.slug}>{part.partTitle}</a>
        <ChapterIndex chapters={part.chapters} active={selfActive === (part.slug + "-block")} />
      </li>
    });
    return (
      <Scrollspy className="scrollspy" offset={+100} items={slugs}
        currentClassName={ 'scrollspy-current' }
        onUpdate={this.setActive}>
        {_parts}
      </Scrollspy>
    );
  }
}

export const Index = ({parts}: {parts: AGLCPart[]}) => {
  return (
    <PartIndex parts={parts} />
  )
}
