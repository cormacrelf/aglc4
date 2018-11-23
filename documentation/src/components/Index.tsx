import React from 'react';
import { AGLCPart, AGLCChapter, AGLCUnit, AGLCRule } from '../titles';
import Scrollspy from 'react-scrollspy';

// type GetChildren = ((item: IFace) => { getChildren: GetChildren,  })
interface Props {
  items: IFace[];
  liClass: string;
  render: (item: any, active: boolean) => JSX.Element;
  active: boolean;
  title: (item: any) => string | JSX.Element;
  scroll?: boolean;
}
interface State {
  selfActive: string;
}
interface IFace {
  slug: string;
}

// function scrollToId(id: string) {
//   let base = id.replace(/-block$/, "");
//   let navEl = document.getElementById(base + '-nav');
//   navEl && navEl.scrollIntoView({block: 'end', behavior: 'smooth'});
// }

function setActive(comp: React.Component<Props, State>) {
  return ((el: Element) => {
    if (el && el.id) {
      comp.setState({ selfActive: el.id });
      // if (comp.props.scroll && comp.props.active) {
      //   // scrollToId(el.id);
      // }
    }
  });
}

class IndexLevel extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { selfActive: "_______" };
  }
  // componentDidUpdate(prevProps: Props) {
    //   if (!prevProps.active && this.props.active && this.state.selfActive) {
    //    scrollToId(this.state.selfActive);
    //   }
    // }
  render(): JSX.Element {
    const { items, active, render, liClass, title } = this.props;
    const { selfActive } = this.state;
    let slugs: string[] = [];
    let us = items.map(item => {
      let selfA = active && selfActive === (item.slug + "-block");
      slugs.push(item.slug + "-block");
      return <li className={liClass} key={item.slug} id={item.slug + "-nav"}>
        <a href={'#'+item.slug}>{ title(item) }</a>
        { render(item, selfA) }
      </li>
    })
    return (
      <Scrollspy className="scrollspy" offset={-100} items={slugs}
        currentClassName={ active && 'scrollspy-current' || '' }
        onUpdate={setActive(this)}>
      {us}
      </Scrollspy>
    )
  }
}

const RuleIndex = (unit: AGLCUnit, active: boolean) => {
  return (
  <IndexLevel items={unit.rules} active={active} liClass="nav-rule" scroll={true}
    title={(rule: AGLCRule) => rule.ruleId + " " + rule.ruleTitle}
    render={ () => <></> }/>
  )
}

const UnitIndex = (chapter: AGLCChapter, active: boolean) => {
  return (
  <IndexLevel items={chapter.units} active={active} liClass="nav-unit"
    title={(unit: AGLCUnit) => unit.parsed.ruleId + " " + unit.parsed.rest}
    render={RuleIndex}/>
  )
}

const ChapterIndex = (part: AGLCPart, active: boolean) => {
  return (
  <IndexLevel items={part.chapters} active={active} liClass="nav-chapter"
    title={(chapter: AGLCChapter) => chapter.chapterNumber + " " + chapter.chapterTitle}
    render={UnitIndex}/>
  )
}

const PartIndex = (parts: AGLCPart[]) => {
  return (
  <IndexLevel items={parts} active={true} liClass="nav-part"
    title={(part: AGLCPart) => part.partTitle}
    render={ChapterIndex}/>
  )
}

export const Index = ({parts}: {parts: AGLCPart[]}) => {
  return PartIndex(parts);
};
