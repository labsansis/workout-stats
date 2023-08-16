import { MouseEvent as ReactMouseEvent, useState, ReactNode } from "react";
import { db } from "../../firebase";
import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { userState } from "../../common/recoilStateDefs";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { PulseLoader } from "react-spinners";
import { LuHelpCircle } from "react-icons/lu";

function UploadKey() {
  const [uploadKey, setUploadKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const user = useRecoilValue(userState);

  const fetchOrGenUploadKey = () => {
    setLoading(true);
    fetchUploadKey()
      .then((key) => key || genUploadKey())
      .then((key) => {
        if (!key) {
          throw new Error();
        }
        setUploadKey(key);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  const fetchUploadKey = async () => {
    if (!user) return;
    const docsnap = await getDoc(
      doc(db, "users", user.id, "accessTokens", "accessTokens"),
    );
    const uats = docsnap.data() as UserAccessTokens;
    return uats?.extensionUploadToken;
  };

  const genUploadKey = async () => {
    if (!user) return null;
    const newUploadKey = uuidv4().replace(/-/g, "");
    await setDoc(doc(db, "users", user.id, "accessTokens", "accessTokens"), {
      extensionUploadToken: newUploadKey,
    });
    return newUploadKey;
  };

  if (error) {
    return (
      <span className="text-[#b91c1c]">
        Could not retrieve the key. Please try again.
      </span>
    );
  }

  if (uploadKey) {
    return <>{uploadKey}</>;
  }

  return loading ? (
    <PulseLoader />
  ) : (
    <a
      className="rounded-lg p-2 text-sm border-2 border-cyan-800 text-cyan-800 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-white cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        fetchOrGenUploadKey();
      }}
    >
      Show key
    </a>
  );
}

function Modal(props: ModalProps) {
  if (!props.isOpen) return <></>;

  return (
    <>
      <div
        className="fixed top-0 left-0 bg-slate-800 w-full h-full z-[101] opacity-80"
        onClick={props.onRequestClose}
      ></div>
      <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] border-2 border-slate-800 rounded-lg p-5 w-[90%] lg:max-w-[50%] z-[102] bg-white">
        <div className="font-bold mb-4 pb-4 border-b-[1px]">{props.title}</div>
        <div>{props.content}</div>
        <div className="my-5 ">
          <a
            className="rounded-lg p-2 text-sm border-2 border-cyan-800 text-cyan-800 disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-white cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              props.onRequestClose();
            }}
          >
            OK
          </a>
        </div>
      </div>
    </>
  );
}

type ModalProps = {
  title: string;
  content: ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
};
export default function Account() {
  const user = useRecoilValue(userState);
  const [uploadKeyModalOpen, setUploadKeyModalOpen] = useState(false);

  const handleUploadKeyHelpClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    setUploadKeyModalOpen(true);
  };

  return (
    <>
      <h1>Account</h1>
      <div className="mt-4 border-t-[1px]">
        <div className="py-3 border-b-[1px] lg:flex">
          <div className="lg:w-[250px] font-medium text-sm lg:text-base pb-3 lg-pb-0">
            Email
          </div>
          <div className="">{user?.email}</div>
        </div>
        <div className="py-3 border-b-[1px] lg:flex">
          <div className="lg:w-[250px] font-medium text-sm lg:text-base pb-3 lg-pb-0">
            Extension Upload Key{" "}
            <a href="" onClick={handleUploadKeyHelpClick}>
              <LuHelpCircle style={{ display: "inline" }} />
            </a>
          </div>
          <div className="">
            <UploadKey />
          </div>
        </div>
      </div>
      <Modal
        isOpen={uploadKeyModalOpen}
        title="Extension Upload Key"
        content={
          <>
            <p className="pb-2">
              The upload key is used to send your workouts from the Garmin
              Workout Downloader browser extension directly to Workout Stats.
            </p>
            <p className="pb-2">
              This means you do not need to download the workout files to your
              device and upload them here!
            </p>
          </>
        }
        onRequestClose={() => setUploadKeyModalOpen(false)}
      />
    </>
  );
}

type UserAccessTokens = {
  extensionUploadToken?: string;
};
