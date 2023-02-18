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
      answer: "You can track your order by visiting the 'Order History' section of your account. If you do not have an account, you can track your order using the tracking number provided in your shipping confirmation email."
    },
    {
      question: "What is your return policy?",
      answer: "Our return policy allows you to return an item within 30 days of receiving it. To be eligible for a return, the item must be in its original condition and packaging. For more information, please visit our Returns page."
    },
    {
      question: "How do I make a purchase?",
      answer: "To make a purchase, add the desired item to your cart, and then proceed to checkout. Fill in the required information and complete the payment."
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
