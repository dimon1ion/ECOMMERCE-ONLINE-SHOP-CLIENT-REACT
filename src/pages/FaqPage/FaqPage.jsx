import {
  Collapse,
  Button,
  CardBody,
  Card,
  CardHeader,
  UncontrolledCollapse,
} from "reactstrap";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../../components/Navigation";
import backImage from "../../assets/styles/backImage.module.scss";
import s from "./FaqPage.module.scss";

export default function FaqPage(props) {
  const [navigation, setNavigation] = useState([{ name: "Home", ref: "/home" }, { name: "FAQ" }]);
  const [isOpen, setIsOpen] = useState(false);

  const faqData =[
    {
      question: "How do I track my order?",
      answer: "You can track your order by visiting the 'Order History' section of your account. You can cancel your order by contacting our customer service team at nail.shamsudinov@gmail.com or sams_bd16@itstep.edu.az"
    },
    {
      question: "How do I make a purchase?",
      answer: "To make a purchase, add the desired item to your cart, and then proceed to checkout. Fill in the required information and complete the payment."
    },
    {
      question: "How do I change my contact information?",
      answer: "You can change your contact information by visiting the 'My Account' section of your account. Phone and mail change require email confirmation."
    },
    {
      question: "I forgot my password. What should I do?",
      answer: "You can reset your password by visiting the 'Forgot Password' section of your account. You will receive an email with a link to reset your password."
    }
  ]

  return (
    <>
      <section className={`${backImage["back-image"]} ${s["categories"]}`}>
        <div className="container">
          <Navigation navigationArr={navigation} title={"Faq"} />
          
        </div>
        <div className="container">
          <h2 className="text-center mt-5 mb-5" style={{color: "white"}}>Frequently Asked Questions</h2>
          {faqData.map((faq, index) => (
            <div key={index}>
              <Button
                color="light"
                id={`toggler${index + 1}`}
                style={{ marginBottom: "1rem", marginTop: "2rem"  }}
              >
                {faq.question}
              </Button>
              <UncontrolledCollapse toggler={`#toggler${index + 1}`}>
                <Card>
                  <CardBody>{faq.answer}</CardBody>
                </Card>
              </UncontrolledCollapse>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
