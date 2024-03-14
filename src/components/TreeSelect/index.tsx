import {AiOutlineDown} from "react-icons/ai";
import type {ITreeNode} from "./type";
import TreeNode from './TreeNode';
import {createPortal} from "react-dom";
import React, {useEffect, useMemo, useRef, useState} from "react";

interface TreeSelectProps {
  open?: boolean;
  placement?: string;
  separator?: string;
  value?: number[];
  treeData: ITreeNode[];
  onSelect?: (targetId: number, pathIds: number[]) => void;
}

export default function TreeSelect({
                                     open,
                                     treeData,
                                     placement = '选择省份',
                                     separator = ' / ',
                                     onSelect,
                                     value
                                   }: TreeSelectProps) {
  const [text, setText] = useState<string>()
  const [_open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open !== undefined) {
      setOpen(open);
    }
  }, [open]);

  const treeMap = useMemo(() => {
    const map: Map<string, string> = new Map();

    function buildMap(list: ITreeNode[], pid: string) {
      list?.forEach((elem) => {
        const comId = `${pid}${elem.id}`;
        map.set(comId, elem.name);
        if (elem.children) {
          buildMap(elem.children, comId)
        }
      })
    }

    buildMap(treeData, '0');

    return map;
  }, [treeData])

  useEffect(() => {
    if (value) {
      const list: string[] = [];
      let comId = '0';
      for (let i = 0; i < value.length; i++) {
        comId = `${comId}${value[i]}`;
        const target = treeMap.get(comId);
        if (target) {
          list.push(target)
        }

      }
      setText(list.join(separator))
    }

  }, [value, treeData]);

  useEffect(() => {
    window.addEventListener('mouseup', handleOnClose, true);
    return () => {
      window.removeEventListener('mouseup', handleOnClose, true)
    }
  }, []);

  function isCtrl() {
    return open === undefined;
  }

  /**
   * 判断元素是否超出弹框
   * @param ele
   */
  function inPopup(ele: any) {
    return (
      wrapRef.current?.contains(ele) || popupRef.current?.contains(ele) || ele === popupRef.current
    )
  }

  function handleOnClose(e: MouseEvent) {
    if (!inPopup(e.target) && open === undefined) {
      setOpen(false);
    }
  }

  function handleOnShow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isCtrl()) {
      setOpen(true);
    }
  }

  function handleOnSelect(id: number, pathIds: number[]) {
    onSelect?.(id, pathIds);
    if (isCtrl()) {
      setOpen(false);
    }
  }

  return (
    <div className="relative text-base inline-block" ref={wrapRef}>
      <div
        className="border rounded-md py-2 px-4 flex items-center justify-between cursor-pointer bg-neutral min-w-[180px]"
        onClick={handleOnShow}
      >
        {
          text ? (
            <div className="select-none text-white pr-3">{text}</div>
          ) : (
            <div className="select-none text-secondary pr-3">{placement}</div>
          )
        }

        <div className="text-secondary"><AiOutlineDown/></div>
      </div>
      {
        _open && createPortal((
          <div
            className="select-none text-sm absolute z-10 shadow py-2 rounded-md bg-neutral text-white"
            style={{
              top: (wrapRef.current?.offsetTop || 0) + (wrapRef.current?.offsetHeight || 0) + 4,
              left: wrapRef.current?.offsetLeft,
              minWidth: 180,
              animation: 'growDown 150ms ease-in-out forwards',
              transformOrigin: 'top center'
            }}
            ref={popupRef}
          >
            <TreeNode
              value={value}
              treeData={treeData}
              onSelect={handleOnSelect}
            />
          </div>
        ), document.body)
      }
    </div>
  )
}
