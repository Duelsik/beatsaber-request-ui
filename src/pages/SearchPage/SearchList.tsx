import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Translation } from "react-i18next";
import styled from "styled-components";
import AppEnvContext, { RankedRecordMap } from "../../AppEnvContext";
import { hideScrollbars } from "../../common/styles/hideScrollbars";
import { LayoutRowBase } from "../../components/LayoutRow/LayoutRow";
import { SongListDocsItem } from "./SearchPage";
import { CopyIcon } from "./CopyIcon";

// Trimmed LowerCase
const stringTLC = (s: string) => s.toLocaleLowerCase().trim();

const autoMappers = ["Beat Sage", "Deep Saber"];
const autoMappersTLC = autoMappers.map(stringTLC);

const SearchListContainer = styled.div`
  box-sizing: border-box;
  height: calc(100vh - (52px * 2));
  padding-bottom: 1rem;
  overflow-y: scroll;

  ${hideScrollbars}
`;

const CopyButton = styled.button`
  outline: none;
  box-sizing: border-box;
  height: 40px;
  padding: 10px 10px;
  margin-left: 12px;
  border-radius: 20px;
  border: 0px solid transparent;
  cursor: pointer;

  font-weight: normal;
  font-size: 0.8rem;
  color: var(--text);
  background-color: var(--background-input);
  opacity: 0.9;

  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  transition: width 0.03s linear;

  & > svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    opacity: 1;
  }
`;

const CopyButtonText = styled.span`
  margin-right: 5px;
`;

const PostCopyTooltip = styled.div`
  position: absolute;
  margin-top: 2px;
  height: 90%;
  top: 0;
  right: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ddd;
  padding: 0 10px;
  border: 0px solid transparent;
  border-radius: 10px;
`;

const isCreatedByAutomapper = (docData: SongListDocsItem) => {
  const songNameTLC = stringTLC(docData.metadata.songName);
  const songAuthorNameTLC = stringTLC(docData.metadata.songAuthorName);
  const levelAuthorNameTLC = stringTLC(docData.metadata.levelAuthorName);

  return autoMappersTLC.some((autoMapperTLC) => {
    return (
      songNameTLC.includes(autoMapperTLC) ||
      songAuthorNameTLC.includes(autoMapperTLC) ||
      levelAuthorNameTLC.includes(autoMapperTLC)
    );
  });
};

let hack = 0;
const Item = (rankedHashes: RankedRecordMap, framePanel: boolean, frameFullvideo: boolean) => {
  const _Item = (docData: SongListDocsItem) => {
    const [copied, setCopied] = React.useState(false);
    const coverURL = `https://beatsaver.com${docData.coverURL}`;
    const allVotes = docData.stats.upVotes + docData.stats.downVotes;
    const percentVotes = ~~((docData.stats.upVotes / allVotes) * 1000) / 10;

    const shouldBeHidden = isCreatedByAutomapper(docData);

    if (shouldBeHidden) return <></>;

    const isRanked = !!rankedHashes[docData.hash.toLowerCase()];

    return (
      <LayoutRowBase
        key={docData.hash}
        style={{
          ...((framePanel && { height: "88px" }) || (frameFullvideo && { height: "60px" }) || {}),
          backgroundColor: isRanked ? "var(--background-secondary)" : "invalid-color",
          borderBottom: "1px solid var(--border)"
        }}
      >
        <div className="doc__container">
          <div className="doc__cover">
            <img src={coverURL} />
          </div>
          <div
            className="doc__mapdata"
            style={(framePanel && { height: "88px" }) || (frameFullvideo && { height: "60px" }) || {}}
          >
            <div className="doc__name">{docData.metadata.songName}</div>
            <div className="doc__author">{docData.metadata.songAuthorName}</div>
            <div className="doc__mapper">{docData.metadata.levelAuthorName}</div>
          </div>
          {!framePanel ? (
            <>
              <div className="doc__saverdata">
                <div className="doc__key">{docData.key} 🔑</div>
                <div className="doc__downloads">{docData.stats.downloads} 💾</div>
                {isRanked ? <div className="doc__score--percentvotes">Ranked ⭐</div> : null}
              </div>
              <div className="doc__scoredata">
                <div className="doc__score--upvotes">{docData.stats.upVotes} 👍</div>
                <div className="doc__score--downvotes">{docData.stats.downVotes} 👎</div>
                <div className="doc__score--percentvotes">{percentVotes}% 💯</div>
              </div>
            </>
          ) : (
            <div
              className="doc__mapdata"
              style={{
                height: "85px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <div className="doc__score--upvotes">{docData.stats.upVotes} 👍</div>
              <div className="doc__score--downvotes">{docData.stats.downVotes} 👎</div>
              <div className="doc__score--percentvotes">{percentVotes}% 💯</div>
              <div className="doc__downloads">{docData.stats.downloads} 💾</div>
              {isRanked ? <div className="doc__score--percentvotes">Ranked ⭐</div> : null}
              <div className="doc__key">{docData.key} 🔑</div>
            </div>
          )}
          <div className="doc__cta">
            {!copied ? (
              <CopyToClipboard text={`!bsr ${docData.key}`} onCopy={() => setCopied(true)}>
                <CopyButton
                  style={{ backgroundColor: isRanked ? "var(--background-secondary-buttonover)" : "invalid-color" }}
                >
                  <CopyButtonText>
                    <Translation>{(t) => t("Copy")}</Translation>
                  </CopyButtonText>
                  <CopyIcon />
                </CopyButton>
              </CopyToClipboard>
            ) : (
              <PostCopyTooltip>
                <Translation>{(t) => t("Paste on chat")}</Translation>
                <br />
                <Translation>{(t) => t("to make request")}</Translation>
              </PostCopyTooltip>
            )}
          </div>
        </div>
      </LayoutRowBase>
    );
  };
  return _Item;
};

const _ItemList = ({
  documentList,
  rankedHashes,
  framePanel,
  frameFullvideo
}: {
  documentList: SongListDocsItem[];
  rankedHashes: RankedRecordMap;
  framePanel: boolean;
  frameFullvideo: boolean;
}) => {
  const renderedItems = documentList.map(Item(rankedHashes, framePanel, frameFullvideo));

  return (
    <SearchListContainer>
      <LayoutRowBase style={{ marginTop: "-45px" }} />
      {renderedItems}
      {frameFullvideo ? <LayoutRowBase /> : null}
    </SearchListContainer>
  );
};

export default function ItemList({ documentList }: { documentList: SongListDocsItem[] }): JSX.Element {
  return (
    <AppEnvContext.Consumer>
      {(context) => (
        <_ItemList
          documentList={documentList}
          rankedHashes={context.rankedHashes}
          framePanel={context.framePanel}
          frameFullvideo={context.frameFullvideo}
        />
      )}
    </AppEnvContext.Consumer>
  );
}