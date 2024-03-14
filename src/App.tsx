import React, {useState} from 'react';
import TreeSelect from "./components/TreeSelect";

function App() {
  const [cityIds, setCityIds] = useState<number[] | undefined>([5, 7])
  return (
    <div className="flex justify-center h-screen items-center">
      <TreeSelect
        treeData={[
          {
            "id": 1,
            "name": "北京",
          },
          {
            "id": 2,
            "name": "北京",
            "children": [
              {
                "id": 3,
                "name": "朝阳区"
              },
              {
                "id": 4,
                "name": "海淀区"
              }
            ]
          },
          {
            "id": 5,
            "name": "上海",
            "children": [
              {
                "id": 6,
                "name": "浦东新区",
                "children": [
                  {
                    "id": 6,
                    "name": "浦东新区浦东新区浦东新区浦东新区"
                  },
                  {
                    "id": 7,
                    "name": "黄浦区"
                  },
                ]
              },
              {
                "id": 7,
                "name": "黄浦区"
              }
            ]
          }
        ]}
        value={cityIds}
        onSelect={(targetId, pathIds) => {
          console.log(pathIds);
          setCityIds(pathIds);
        }}
      />
    </div>
  );
}

export default App;
