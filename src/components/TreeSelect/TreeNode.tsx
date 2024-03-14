import type {ITreeNode} from './type';
import React, {useEffect, useRef, useState} from "react";
import {AiOutlineRight} from "react-icons/ai";
import {cn} from "../../lib/utils";

export interface TreeNodeProps {
  treeData: ITreeNode[];
  value?: number[];
  onSelect?: (id: number, pathIds: number[]) => void;
}

export default function TreeNode({value, treeData, onSelect}: TreeNodeProps) {
  const [selectId, setSelectId] = useState<number>()
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectId(value?.[0]);
  }, [value]);

  function handleOnSelect(id: number, pathIds: number[]) {
    if (selectId) {
      onSelect?.(id, [selectId, ...pathIds]);
    }
  }

  return (
    <div className="overflow-y-auto max-h-[400px]">
      {treeData.map(node => (
        <div
          key={node.id}
          className=""
          onMouseEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectId(node.id);
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            ref={dom}
            className={cn(
              'cursor-pointer py-2 px-3 hover:bg-accent flex items-center justify-between',
              node.id === selectId ? 'bg-accent' : ''
            )}
            onClick={() => {
              if (!node?.children) {
                onSelect?.(node.id, [node.id]);
              }
            }}
          >
            <div className="whitespace-nowrap">{node.name}</div>
            {
              node?.children && (
                <div className="text-secondary"><AiOutlineRight/></div>
              )
            }
          </div>
          {
            node.id === selectId && node?.children && (
              <div
                className="shadow py-2 rounded-md bg-neutral text-white absolute z-10"
                style={{
                  left: dom.current?.offsetWidth,
                  top: 0,
                  minWidth: dom.current?.offsetWidth,
                }}>
                <TreeNode key={node.id} value={value?.slice(1)} treeData={node.children} onSelect={handleOnSelect}/>
              </div>
            )
          }
        </div>
      ))}
    </div>
  )
}
