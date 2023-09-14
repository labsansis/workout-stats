import { useState } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../common/recoilStateDefs";
import { saveInputChangeInHookState } from "../../common/functions";

export default function Feedback() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useRecoilValue(userState);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(false);
    setSubmitSuccess(false);
    fetch(
      "https://7sztonm5g3.execute-api.eu-west-1.amazonaws.com/api/feedback",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          name,
          email,
          message,
        }),
      },
    )
      .then((resp) => {
        if (resp.status < 200 || resp.status >= 300) {
          throw Error(resp.statusText);
        }
        setLoading(false);
        setSubmitSuccess(true);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setSubmitError(true);
      });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-[78px] right-[10px] w-[90%] md:w-[300px] shadow-lg shadow-slate-400 bg-white rounded-md">
          <div className="flex justify-between bg-slate-100 rounded-t-md">
            <div className="p-2 font-medium text-cyan-800 ">Feedback</div>
            <div
              className="p-2 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineClose className="w-[1.3em] h-[1.3em]" />
            </div>
          </div>
          <div className="p-3">
            <form onSubmit={handleSubmit}>
              <p className="text-sm pb-2">
                Any thoughts? Leave your feedback or message here!
              </p>
              <p className="text-sm pb-2 mb-3">
                Or go on{" "}
                <a
                  className="underline"
                  href="https://www.reddit.com/r/Garmin/comments/15d06l6/a_better_interface_for_strength_training_data/"
                  target="_blank"
                >
                  Reddit
                </a>{" "}
                if you prefer.
              </p>
              <div>
                <input
                  type="text"
                  className="w-full text-sm border rounded-md mb-3 p-1"
                  placeholder="Name"
                  value={user?.name}
                  onChange={saveInputChangeInHookState(setName)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full text-sm border rounded-md mb-3 p-1"
                  placeholder="Email"
                  value={user?.email}
                  onChange={saveInputChangeInHookState(setEmail)}
                />
              </div>
              <textarea
                className="w-full min-h-[10em] text-sm border rounded-md p-1"
                placeholder="Feedback / Message"
                onChange={saveInputChangeInHookState(setMessage)}
                maxLength={2000}
              />
              <input
                type="submit"
                disabled={loading}
                value="Send Feedback"
                className="center text-white bg-cyan-800 mx-auto w-full py-1 rounded-sm mt-2 text-sm cursor-pointer"
              />
              {submitError && (
                <p className="text-red-500 text-sm">
                  Failed to send feedback. Try again.
                </p>
              )}
              {submitSuccess && (
                <p className="text-lime-500 text-sm">Feedback sent!</p>
              )}
              {!submitError && !submitSuccess && (
                <p className="text-sm">&nbsp;</p>
              )}
            </form>
          </div>
        </div>
      )}
      <div
        className="fixed bottom-[20px] right-[20px] w-[3em] h-[3em] bg-cyan-800 rounded-full p-[0.55em] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <AiOutlineClose
            className="w-[1.8em] h-[1.8em]"
            style={{ fill: "white" }}
          />
        ) : (
          <MdOutlineChatBubbleOutline
            className="w-[2em] h-[2em]"
            style={{ fill: "white" }}
          />
        )}
      </div>
    </>
  );
}
